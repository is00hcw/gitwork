package net.atsmart.web;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import net.atsmart.service.JedisFactory;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.GeoResult;
import org.springframework.data.geo.GeoResults;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeospatialIndex;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@RequestMapping("/mongo")
@Controller
public class MongoLbsController implements InitializingBean {
  @Autowired
  LocationRepository repo;

  @Autowired
  MongoTemplate template;

  public LocationRepository getRepo() {
    return repo;
  }

  public void setRepo(LocationRepository repo) {
    this.repo = repo;
  }

  public MongoTemplate getTemplate() {
    return template;
  }

  public void setTemplate(MongoTemplate template) {
    this.template = template;
  }

  public MongoLbsController() {

  }

  @Override
  public void afterPropertiesSet() throws Exception {
    if (template != null) {
      logger.debug("afterPropertiesSet init GEO_2DSPHERE");
      template.indexOps(Location.class).ensureIndex(
          new GeospatialIndex("position").typed(GeoSpatialIndexType.GEO_2DSPHERE));
    }
  }

  protected static final Logger logger = LoggerFactory.getLogger(MongoLbsController.class);

  private static final int ERROR = -1;

  private static final int OK = 0;

  private static final int LOC_TIMEOUT = -1; // forever, never expire

  protected String toJsonResponse(int code, String msg) {
    try {
      return new JSONObject().put("code", code).put("msg", msg).toString();
    } catch (Exception e) {
      return "{'code':-1,'msg':'" + e.getMessage() + "'}";
    }
  }

  @RequestMapping("/upload_user_location")
  @ResponseBody
  public String createPoi(@RequestParam("title") String title, @RequestParam("tags") String tags,
      @RequestParam("lat") double lat, @RequestParam("lng") double lng,
      @RequestParam("openid") String openid, @RequestParam("uid") String uid,
      @RequestParam("user_img") String userImage, HttpServletRequest req) {
    try {
      String redisKey = "mloc_" + openid;
      String cache = JedisFactory.get(redisKey);
      Location entity = new Location(title, openid, uid, userImage, tags, lng, lat);
      if (StringUtils.isEmpty(cache)) { // 第一次提交位置
        entity = repo.save(entity);
        JSONObject data =
            new JSONObject().put("poi_id", entity.getId()).put("lat", lat).put("lng", lng);
        JedisFactory.set(redisKey, LOC_TIMEOUT, data.toString());
        return toJsonResponse(OK, "add poi " + entity.getId() + " " + lat + "," + lng);

      } else {
        logger.debug("cache {} : {}", redisKey, cache);

        JSONObject cacheData = new JSONObject(cache);
        String poiId = cacheData.optString("poi_id");
        entity.setId(poiId); // 设置主键id
        entity = repo.save(entity); // 更新记录
        JSONObject data =
            new JSONObject().put("poi_id", entity.getId()).put("lat", lat).put("lng", lng);
        JedisFactory.set(redisKey, LOC_TIMEOUT, data.toString());

        return toJsonResponse(OK, "update poi " + entity.getId() + " " + lat + "," + lng);
      }
    } catch (Exception e) {
      logger.error("upload_user_location err", e);
      return toJsonResponse(ERROR, e.getMessage());
    }
  }

  @RequestMapping("/find_nearby_users")
  @ResponseBody
  public String nearby(@RequestParam("lat") double lat, @RequestParam("lng") double lng,
      @RequestParam("radius") double radius, @RequestParam("page_index") int pageIndex,
      HttpServletRequest req) {
    try {
      GeoResults<Location> result =
          repo.findByPositionNear(new Point(lng, lat), new Distance(radius / 1000,
              Metrics.KILOMETERS));
      List<GeoResult<Location>> locs = result.getContent();
      logger.debug("neary {},{} {} : {}", lng, lat, radius, locs == null ? 0 : locs.size());

      int size = Math.min(locs.size(), 20); // 当前返回的数据量 TODO
      JSONObject resp = new JSONObject();
      resp.put("total", locs.size());
      resp.put("size", size);
      JSONArray data = new JSONArray();
      for (int i = 0; i < size; i++) {
        GeoResult<Location> geoRes = locs.get(i);
        Location loc = geoRes.getContent();
        JSONObject res = new JSONObject();
        res.put("tags", loc.getTags());
        res.put("title", loc.getTitle());
        res.put("openid", loc.getOpenid());
        res.put("uid", loc.getUid());
        res.put("user_img", loc.getUserImg());
        res.put("distance", geoRes.getDistance().getValue() * 1000);
        res.put("lng", loc.getPosition()[0]);
        res.put("lat", loc.getPosition()[1]);
        data.put(res);
      }
      resp.put("data", data);
      resp.put("code", OK);
      return resp.toString();
    } catch (Exception e) {
      logger.error("nearby err", e);
      return toJsonResponse(ERROR, e.getMessage());
    }
  }

}

package es;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.elasticsearch.ElasticsearchException;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.ImmutableSettings;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;

// http://ip:9200/users/_analyze?analyzer=standard&pretty=true&text=%E6%88%91%E6%98%AF%E4%B8%AD%E5%9B%BD%E4%BA%BA
public class EsClient {
  private Client client;

  public void init() {
    Settings settings = ImmutableSettings.settingsBuilder()
    // // 指定集群名称
    // .put("cluster.name", "elasticsearch")
    // // 探测集群中机器状态
    // .put("client.transport.sniff", true)
        .build();
    client =
        new TransportClient(settings).addTransportAddress(new InetSocketTransportAddress(
            "ip", 9300));
  }

  public void close() {
    client.close();
  }

  public void createIndex() {
    try {
      for (int i = 0; i < 10; i++) {
        JSONObject user = new JSONObject();
        user.put("id", i);
        user.put("name", "huang fox " + i);
        user.put("age", i);
        IndexResponse res =
            client.prepareIndex("users", "user").setId("" + i).setSource(user.toString()).execute()
                .actionGet();
        System.out.println(res.getVersion());
      }
      {
        DeleteResponse response = client.prepareDelete("users", "user", "0").execute().actionGet();
        System.out.println(response.getId());
        System.out.println(response.getHeaders());
      }
      {
        GetResponse response = client.prepareGet("users", "user", "1").execute().actionGet();
        System.out.println("response.getId():" + response.getId());
        System.out.println("response.getSourceAsString():" + response.getSourceAsString());
      }
    } catch (Exception e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
  }
  
  public void createIndex2() {
     try {
      {
          JSONObject user = new JSONObject();
          user.put("id", 1);
          user.put("name", "huang fox 1111"  );
          user.put("age", 1);
          IndexResponse res =
              client.prepareIndex("users", "user").setId("1"  ).setSource(user.toString()).execute()
                  .actionGet();
          System.out.println(res.getVersion());
        }
        System.out.println("create again---");
      {
        JSONObject user = new JSONObject();
        user.put("id", 1);
        user.put("name", "huang fox 111111"  );
        user.put("age", 1);
        IndexResponse res =
            client.prepareIndex("users", "user").setId("1"  ).setSource(user.toString()).execute()
                .actionGet();
        System.out.println(res.getVersion());
      }
    } catch (ElasticsearchException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    } catch (JSONException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
    
  }


  public static void main(String[] args) {
    EsClient client = new EsClient();
    client.init();
    client.createIndex2();
  //  client.search();
    //client.scroll();
    client.close();
  }

  private void scroll() {
    QueryBuilder qb = QueryBuilders.termQuery("name", "fox");
    SearchResponse scrollResp =
        client.prepareSearch("users").setSearchType(SearchType.SCAN)
            .setScroll(new TimeValue(60000)).setQuery(qb)
            // 100 hits per shard will be returned for each scroll
            .setSize(100).execute().actionGet();
    // Scroll until no hits are returned
    while (true) {

      for (SearchHit hit : scrollResp.getHits().getHits()) {
        System.out.println(hit.getScore());
        System.out.println(hit.getSource());
      }
      scrollResp =
          client.prepareSearchScroll(scrollResp.getScrollId()).setScroll(new TimeValue(600000))
              .execute().actionGet();
      // Break condition: No hits are returned
      if (scrollResp.getHits().getHits().length == 0) {
        break;
      }
    }
  }

  private void search() {
    QueryBuilder qb = QueryBuilders.fuzzyQuery("name", "fox");  //QueryBuilders.termQuery("name", "fox");
    SearchResponse res =
        client.prepareSearch("users").setTypes("user")
            // .setScroll(new TimeValue(5000)).setSearchType(SearchType.SCAN)
            .setSearchType(SearchType.DFS_QUERY_THEN_FETCH).setQuery(qb).setFrom(0).setSize(60)
            .setExplain(true).execute().actionGet();
    for (SearchHit hit : res.getHits()) {
      System.out.println(hit.getScore());
      System.out.println(hit.getSource());
    }
  }

}

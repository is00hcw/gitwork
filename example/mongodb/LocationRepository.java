package net.atsmart.web;

import java.util.List;

import org.springframework.data.geo.Box;
import org.springframework.data.geo.Circle;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.GeoResults;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.repository.MongoRepository;

// http://docs.spring.io/spring-data/mongodb/docs/1.3.3.RELEASE/reference/html/mongo.repositories.html

public interface LocationRepository extends MongoRepository<Location, String> {
  // 注意跟属性名对应
  GeoResults<Location> findByPositionWithin(Circle c);

//  Point location = new Point(-73.99171, 40.738868);
//  NearQuery query = NearQuery.near(location).maxDistance(new Distance(10, Metrics.MILES));
//  GeoResults<Restaurant> = operations.geoNear(query, Restaurant.class);

  // No metric: {'geoNear' : 'person', 'near' : [x, y], maxDistance : distance }
  // Metric: {'geoNear' : 'person', 'near' : [x, y], 'maxDistance' : distance,
  // 'distanceMultiplier' : metric.multiplier, 'spherical' : true }
  GeoResults<Location> findByPositionNear(Point location, Distance distance);

  GeoResults<Location> findByPositionWithin(Box b);
}

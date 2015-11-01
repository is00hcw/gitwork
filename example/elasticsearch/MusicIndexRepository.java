package es;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

// 可选功能，将音乐信息保存到索引
public interface MusicIndexRepository extends ElasticsearchRepository<Music, String> {

//  Page<Music> findBySongName(String name, Pageable page);
  
  Iterable<Music> findBySongName(String name);
}

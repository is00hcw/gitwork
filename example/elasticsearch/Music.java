package es;

import org.codehaus.jettison.json.JSONObject;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;


//可选功能， 索引保存的数据（ 搜索或推送到设备的音乐信息）
@Document(indexName = "musics", type = "search", shards = 1, replicas = 0)
public class Music {
  @Id
  private String id;

  @Field(type = FieldType.String)
  private String songUrl;

  @Field(type = FieldType.String)
  private String songImg;

  @Field(type = FieldType.Integer)
  private int duration;

  @Field(type = FieldType.String)
  private String songName;

  @Field(type = FieldType.String)
  private String songId;

  @Field(type = FieldType.String)
  private String albumId;

  @Field(type = FieldType.String)
  private String albumName;

  public Music() {
  }
  
  public Music(JSONObject info) {
//    JSONObject info = json.optJSONObject("metaInfo");
    this.songUrl = info.optString("track_url", "");
    this.songImg = info.optString("album_file", "");
    this.duration = info.optInt("track_duration", 0);
    this.songName = info.optString("track_name", "");
    this.songId = info.optString("song_id", "");
    this.albumName = info.optString("album_name", "");
    this.albumId = info.optString("album_id", "");
    String source = info.optString("source", "");
    this.id = source + "_" + songId;
  }
  
  

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getSongUrl() {
    return songUrl;
  }

  public void setSongUrl(String songUrl) {
    this.songUrl = songUrl;
  }

  public String getSongImg() {
    return songImg;
  }

  public void setSongImg(String songImg) {
    this.songImg = songImg;
  }

  public int getDuration() {
    return duration;
  }

  public void setDuration(int duration) {
    this.duration = duration;
  }

  public String getSongName() {
    return songName;
  }

  public void setSongName(String songName) {
    this.songName = songName;
  }

  public String getSongId() {
    return songId;
  }

  public void setSongId(String songId) {
    this.songId = songId;
  }

  public String getAlbumId() {
    return albumId;
  }

  public void setAlbumId(String albumId) {
    this.albumId = albumId;
  }

  public String getAlbumName() {
    return albumName;
  }

  public void setAlbumName(String albumName) {
    this.albumName = albumName;
  }

  @Override
  public String toString() {
    return "Music [id=" + id + ", songUrl=" + songUrl + ", songImg=" + songImg + ", duration="
        + duration + ", songName=" + songName + ", songId=" + songId + ", albumId=" + albumId
        + ", albumName=" + albumName + "]";
  }
}

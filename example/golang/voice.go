package main


import (
  "crypto/hmac"
	"crypto/sha1"
  "encoding/base64"  
  "path/filepath"
  "io/ioutil"
   "bufio"
"net/http"
"os"
 "os/exec"
"io"
"math"
"fmt"
"time"
"strings"
"strconv"
"github.com/juju/errors"
"github.com/go-martini/martini"
"github.com/martini-contrib/cors"
//log "github.com/ngaut/logging"
// stdlog "log"
)

const(
  OSS_URL = "http://oss.atsmart.io/"
  VOICE_HISTORY_URL = "http://api.atsmart.io/v2/node/M700/"
  PUB_DEV_URL = "http://api.atsmart.io/v2/mq/pub2dev"
  OSS_KEY = "CeCqQUaUFXWaakDe"
  OSS_SECRET  = "bgbCdAzBasX6KqjAxm1eWbci4JJMpO"
)

/*
func sample(param martini.Params, req *http.Request) (int, string) {
	addr := param["addr"]
  fmt.Println(addr)
  fmt.Println(param)
  fmt.Println( req.URL.Query() )
	return 200, "ok"
}
*/

func voiceHandler(res http.ResponseWriter, req *http.Request) { // res and req are injected by Martini
    query := req.URL.Query();
    fmt.Println(query);
    mediaId := query.Get("mediaId")
    wechat_token := query.Get("wechat_token")
    did := query.Get("did")
    openid := query.Get("openid")
    uid := query.Get("uid")
    api_token := query.Get("api_token")
    
    startTime := time.Now().Unix();
    fmt.Printf("req start: %d \n", startTime)
    
    amr_file, err := downloadAmr(mediaId, wechat_token);  
    if(err == nil){
      len := ffmpeg(amr_file)
      fmt.Println("mp3 len: " , len)
      mp3_file := strings.Replace(amr_file , ".amr", ".mp3" , 1)
      filename := filepath.Base(mp3_file)
      ossUrl := OSS_URL + filename
      go uploadOss(ossUrl, mp3_file )
    
      fmt.Println("--saveVoiceHistory " + "openid: " + openid + " uid: " + uid + " did: " + did + " api_token: " + api_token)
      go saveVoiceHistory(uid, did, ossUrl,api_token, len);
      go pushDevice(uid, did, ossUrl, api_token, len);
    }
    endTime := time.Now().Unix()
    fmt.Printf("req end: %d , duration: %d \n", endTime, endTime - startTime )
    res.WriteHeader(200) // HTTP 200
 }

func initServer(){
 // addr := "localhost:7000"
  m := martini.Classic()
  /*
  f, err := os.OpenFile("server.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		panic(err)
	}
	defer f.Close()
  m.Map(stdlog.New(f, "[martini]", stdlog.LstdFlags))
   
  m.Use(martini.Static(filepath.Join(binRoot, "assets/statics")))
	m.Use(render.Renderer(render.Options{
		Directory:  filepath.Join(binRoot, "assets/template"),
		Extensions: []string{".tmpl", ".html"},
		Charset:    "UTF-8",
		IndentJSON: true,
	})) */
  
  m.Use(cors.Allow(&cors.Options{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"POST", "GET", "DELETE", "PUT"},
		AllowHeaders:     []string{"Origin", "x-requested-with", "Content-Type", "Content-Range", "Content-Disposition", "Content-Description"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: false,
	}))
  
 // m.Get("/sample/:addr", sample)
  m.Get("/", func() string {
    return "Hello world!"
  })
  
  m.Get("/voice", voiceHandler)
  
  /* m.Get("/", func(r render.Render) {
		r.Redirect("/admin")
	}) */

  // m.Run()
  //m.RunOnAddr(addr)
  m.RunOnAddr(":8000")
}

func saveVoiceHistory(uid, did, ossRet, api_token string, len int){
    createtime := time.Now().Format("2006-01-02 15:04:05")
    data := "[{\"id\":\"" + did + "\",\"data\":{\"resUrl\":\"" + ossRet + "\",\"createTime\":\"" + createtime + "\",\"duration\":" + strconv.Itoa(len) + "}}]"
    msg := "{\"cmd\":\"NodeCreate\",\"data\":" + data + "}";
    fmt.Println(msg)
 
    url := VOICE_HISTORY_URL + uid
    fmt.Println(url)
    client := &http.Client{}
    reqest, _ := http.NewRequest("POST", url, strings.NewReader(msg))
    reqest.Header.Set("Connection","close")
    reqest.Header.Set("TOKEN", api_token )
    reqest.Header.Set("Content-Type","application/json")
 
    resp,err := client.Do(reqest)
    if err != nil {
      fmt.Println(err)
        panic(err)
    }
    defer resp.Body.Close()
     body, err := ioutil.ReadAll(resp.Body)
     fmt.Println("saveVoiceHistory ret: " + string(body))
  
    fmt.Printf("saveVoiceHistory end: %d", time.Now().Unix())
}

func pushDevice(uid, did, ossRet, api_token string, len int){
    createtime := time.Now().Format("2006-01-02 15:04:05")
    data := "{\"timestamp\":\"" + createtime + "\",\"resUrl\":\"" + ossRet   + "\",\"duration\":" + strconv.Itoa(len) + ",\"resMsg\":\"\",\"from\":\"" + uid + "\",\"resType\":\"voice\"}"
    msg := "{\"msgId\" : \"0\",\"magic\" : \"0\",\"msgOrder\" : \"0\",\"cmd\" : \"PushResource\",\"data\" :" + data + "}";
    fmt.Println(msg)
 
    url := PUB_DEV_URL  + "?UID=" + uid + "&DID=" + did + "&PID=M700";
    fmt.Println(url)
    
    client := &http.Client{}
    reqest, _ := http.NewRequest("PUT", url, strings.NewReader(msg))
    reqest.Header.Set("Connection","close")
    reqest.Header.Set("UTOKEN", api_token )
    reqest.Header.Set("DTOKEN", api_token )
    reqest.Header.Set("Content-Type","application/json")
 
    resp,err := client.Do(reqest)
    if err != nil {
      fmt.Println(err)
        panic(err)
    }
    defer resp.Body.Close()
     body, err := ioutil.ReadAll(resp.Body)
     fmt.Println("pushDevice : " + string(body))
     fmt.Printf("pushDevice end: %d \n", time.Now().Unix())
}
  

func downloadAmr(mediaId , wechat_token string) (string, error)  {
  url := "http://file.api.weixin.qq.com/cgi-bin/media/get?media_id=" + mediaId + "&access_token=" + wechat_token
  
    fmt.Println(url);
    client := &http.Client{}
    reqest, _ := http.NewRequest("GET", url, nil)
    reqest.Header.Set("Connection","close")
     
    resp,err := client.Do(reqest)
   //resp, err := http.Get(url)
    if err != nil {
        // handle error
        panic(err)
    }
    defer resp.Body.Close()
    if resp.StatusCode == http.StatusOK {
      fmt.Println(resp.Header)
      if(resp.Header.Get("Content-Type") == "audio/amr"){    
        //body, err := ioutil.ReadAll(resp.Body)
        // fmt.Println(string(body))
        amrFile := "/tmp/" + mediaId +".amr";
        fmt.Println("save file: " + amrFile);
        f, err := os.OpenFile(amrFile, os.O_WRONLY|os.O_CREATE, 0666)
        if err != nil {
            panic(err)
        }
        defer f.Close()
        io.Copy(f, resp.Body)
        fmt.Printf("downloadAmr end: %d \n", time.Now().Unix())
        return  amrFile,nil
      }else{
        return "", errors.New("content-type err : " + resp.Header.Get("Content-Type") ) 
      }
    }
    return "", errors.New(fmt.Sprintf( "resp.StatusCode : %d" , resp.StatusCode)  ) 
}

func ffmpeg(inputfile string) int {
    targetpath := strings.Replace(inputfile , ".amr", ".mp3" , 1)
    cmd1 := "ffmpeg -y -xerror -i " + inputfile + " " + targetpath +  " >/dev/null 2>/dev/null "
	  cmd2 := "ls " + targetpath 
	  cmd3 := "ffmpeg -i " + targetpath + " 2>&1 | grep Duration | cut -d ' ' -f 4 | sed s/,//"
	  all := cmd1 + " ; " + cmd2 +" && " + cmd3;
    fmt.Println("combine cmd: " + all)
    cmd := exec.Command("/bin/sh", "-c", all)
    out, err := cmd.CombinedOutput()
    fmt.Printf("stdout: %s", out)
    if err != nil {
        panic(err.Error())
    }
    ss := string(out)
    if(strings.Index(ss, "No such file") > -1){
      return -1
    }
      
    str := strings.Split( ss, ":")
    fmt.Println(len(str))
      
    if(len(str) >= 3){
      res, err := strconv.ParseFloat( strings.TrimSpace(str[2]) , 32 )
      if(err != nil){
        fmt.Println(err)
        return -1
      }
      
      fmt.Printf("ffmpeg end: %d \n", time.Now().Unix())
      return int(math.Ceil(res))
    }
    return -1
}

func uploadOss(url, inputfile string)  {
   
  accessKeyId := OSS_KEY
  secretAccessKey := OSS_SECRET
  
  fmt.Println(url)
   
   date := time.Now().UTC().Format(time.RFC1123)
   date = strings.Replace(date, "UTC", "GMT" , 1)
  //date := "Fri, 30 Oct 2015 10:49:00 GMT"
  //fmt.Println(date)
  
  filename := filepath.Base(inputfile)
  stringToSign := "PUT\n\napplication/octet-stream\n" + date + "\n/atsmart-oss/" + filename
  fmt.Println("stringtosign " + stringToSign)
  //hmac ,use sha1
	key := []byte(secretAccessKey)
	mac := hmac.New(sha1.New, key)
	mac.Write([]byte(stringToSign))
	sig := base64.StdEncoding.EncodeToString (mac.Sum(nil))
  fmt.Println("sig : " + sig) 
  
    fi, err := os.Open(inputfile)
    if err != nil {
       panic(err) 
    }
    defer fi.Close()
    upload := bufio.NewReader(fi)
  
    client := &http.Client{}
    reqest, _ := http.NewRequest("PUT", url, upload)
    reqest.Header.Set("Connection","close")
    reqest.Header.Set("Content-Type","application/octet-stream")
    reqest.Header.Set("Date", date )
    reqest.Header.Set("Authorization", "OSS " + accessKeyId  +":" + sig)
    
    resp,err := client.Do(reqest)
    if err != nil {
      fmt.Println(err)
        panic(err)
    }
    defer resp.Body.Close()
    body, err := ioutil.ReadAll(resp.Body)
    fmt.Println(string(body))
    fmt.Printf("uploadOss end: %d \n", time.Now().Unix())
}


func main() {
   //time.Sleep(1 * time.Second)
   
   fmt.Printf("server start: %d\n", time.Now().Unix())
   initServer();
    
    /*
    mediaId := "bEumtTF6R3_5Iwmt93z_tIBjH5oki001_2JPKdbNlgsaJfGx9fGFumsRMyX7ZeYN"
    wechat_token := "9Zcr9tNAf0a0hWUZNiTYIP5spg4iNJcrpLWPnRsNq-1ZsBtUgTpkm7iAjNBY6xsQ2_guswn5f8iRTZn6QSNFAj9ZYrPXxCqZIApJcm2SkLEQFLfAIATIO"
    amr, err := downloadAmr(mediaId, wechat_token);  
    if(err == nil){
      len := ffmpeg(amr)
      fmt.Println("mp3 len: %d" , len)
    }
    */
    //sha1
	h := sha1.New()
	io.WriteString(h, "aaaaaa")
	fmt.Printf("%x\n", h.Sum(nil))
 
}

func testUpload(){
  inputfile := "d:/tmp/douban5.json"
  accessKeyId := OSS_KEY
  secretAccessKey := OSS_SECRET
  
  filename := filepath.Base(inputfile)
  url := OSS_URL + filename
  fmt.Println(url)
   
   
   date := time.Now().UTC().Format(time.RFC1123)
   date = strings.Replace(date, "UTC", "GMT" , 1)
  //date := "Fri, 30 Oct 2015 10:49:00 GMT"
  fmt.Println(date)
   
  stringToSign := "PUT\n\napplication/octet-stream\n" + date + "\n/atsmart-oss/" + filename
  fmt.Println("stringtosign " + stringToSign)
  //hmac ,use sha1
	key := []byte(secretAccessKey)
	mac := hmac.New(sha1.New, key)
	mac.Write([]byte(stringToSign))
	sig := base64.StdEncoding.EncodeToString (mac.Sum(nil))
  fmt.Println("sig : " + sig) 
  
    fi, err := os.Open(inputfile)
    if err != nil {
       panic(err) 
    }
    defer fi.Close()
    upload := bufio.NewReader(fi)
  
    client := &http.Client{}
    reqest, _ := http.NewRequest("PUT", url, upload)
    reqest.Header.Set("Connection","close")
    reqest.Header.Set("Content-Type","application/octet-stream")
    reqest.Header.Set("Date", date )
    reqest.Header.Set("Authorization", "OSS " + accessKeyId  +":" + sig)
    
    resp,err := client.Do(reqest)
    if err != nil {
      fmt.Println(err)
        panic(err)
    }
    defer resp.Body.Close()
     body, err := ioutil.ReadAll(resp.Body)
     fmt.Println(string(body))
}
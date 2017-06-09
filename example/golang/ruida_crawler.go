package main

import (
	"bufio"
	"bytes"
	"fmt"
	"github.com/PuerkitoBio/goquery"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"text/template"
	"time"
)

//tracefile(fmt.Sprintf("receive:%s",v))
func tracefile(str_content string) {
	fd, _ := os.OpenFile("debug.txt", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0644)
	fd_time := time.Now().Format("2006-01-02 15:04:05")
	fd_content := strings.Join([]string{"======", fd_time, "=====", str_content, "\n"}, "")
	buf := []byte(fd_content)
	fd.Write(buf)
	fd.Close()
}

func DownloadFile(url string) {
	res, err := http.Get(url)
	if err != nil {
		panic(err)
	}
	f, err := os.Create("qq.exe")
	if err != nil {
		panic(err)
	}
	io.Copy(f, res.Body)
}

type Product struct {
	Title       string   //标题
	Img         string   //图片地址
	Url         string   //访问链接
	Video       string   // 视频
	Desc        string   // 描述
	Category    string   // 分类
	ProductCode string   // code
	ProductId   string   // 产品id
	BrandId     string   // 品牌id
	Company     string   // 公司
	DescHtml    string   // 内容html
	Spec        []string // 规格列表
}

var waitgroup sync.WaitGroup
var productId = 696514460000100000
var brandId = 697970765900869632

var descTpl = `<p style="text-align: center;">
    <span style="font-size: 16px;">{{.Title}}</span>
</p>
{{range .Spec}}
<p style="line-height: 0.9em;">
    <span style="font-size: 14px;">{{.}} </span>
</p>
{{end}}
<p style="line-height: 0.9em;">
    <span style="font-size: 14px;">厂家：{{.Company}}</span>
</p>
<p style="line-height: 0.9em;">
    <span style="font-size: 24px;"><video class="edui-faked-video  video-js" controls="controls" poster="" preload="none" width="100%" height="auto" src="{{.Video}}">
        <source src="{{.Video}}" type="video/mp4"/>
    </video></span>
</p>
<p>
    <span style="font-size: 24px;"><br/></span>
</p>`

var sqlValueTpl = `('{{.ProductId}}','{{.Title}}','{{.ProductCode}}',null,null,'{{.Img}}',null,'0','{{.DescHtml}}',null,'10.00','{{.BrandId}}',null,null,'{{.Url}}');`

func GetBetweenStr(str, start, end string) string {
	n := strings.Index(str, start)
	if n == -1 {
		n = 0
	}
	str = string([]byte(str)[n+len(start):])
	m := strings.Index(str, end)
	if m == -1 {
		m = len(str)
	}
	str = string([]byte(str)[:m])
	return str
}

func createHtml(p *Product) string {
	// t := template.Must(template.ParseFiles("hello.txt"))
	tmpl, err := template.New("descTpl").Parse(descTpl) //建立一个模板，内容是"hello, {{.}}"
	if err != nil {
		panic(err)
	}
	var buffer bytes.Buffer
	err = tmpl.Execute(&buffer, p)
	//err = tmpl.Execute(os.Stdout, p) //将struct与模板合成，合成结果放到os.Stdout里
	if err != nil {
		panic(err)
	}

	//return "'" + p.Desc + "'"
	return strings.Replace(buffer.String(), "\n", "", -1)
}

func buildSql(p *Product) string {
	sql := "insert into `product`(`product_id`,`name`,`product_code`,`original_price`,`create_time`,`image`,`ad_image`,`is_deleted`,`description`,`search_keywords`,`weight`,`brand_id`,`spec`,`score`,`detail_page_url`) values "
	productId++
	p.ProductId = strconv.Itoa(productId)
	p.BrandId = strconv.Itoa(brandId)
	p.Company = "瑞达烟花"

	p.Spec = strings.Split(p.Desc, "\t") // 产品规格 分割成数组
	p.DescHtml = createHtml(p)           // 生成描述的html

	//sql += "('" + strconv.Itoa(productId) + "','" + p.Title + "','" + p.ProductCode + "',null,null,'"
	//sql += p.Img + "',null,'0',"
	//sql += html(p)
	//sql += ",null,'10.00','" + strconv.Itoa(brandId) + "',null,null,'" + p.Url + "');"

	tmpl, err := template.New("sqlValueTpl").Parse(sqlValueTpl) //建立一个模板，内容是"hello, {{.}}"
	if err != nil {
		panic(err)
	}
	var buffer bytes.Buffer
	err = tmpl.Execute(&buffer, p)
	//err = tmpl.Execute(os.Stdout, p) //将struct与模板合成，合成结果放到os.Stdout里
	if err != nil {
		panic(err)
	}

	return sql + buffer.String()
}

func main() {

	out, err1 := os.OpenFile("out.txt", os.O_RDWR|os.O_CREATE, os.ModePerm) //可读写，追加的方式打开（或创建文件）
	if err1 != nil {
		panic(err1)
		return
	}

	defer func() {
		time.Sleep(time.Duration(1 * time.Second))
		out.Sync()
		out.Close()
	}()

	data_arr := make([]Product, 0)
	f, err := os.Open("link.txt")
	if err != nil {
		panic(err)
	}
	defer f.Close()

	rd := bufio.NewReader(f)
	for {
		line, err := rd.ReadString('\n') //以'\n'为结束符读入一行
		if err != nil || io.EOF == err {
			break
		}
		//fmt.Println(line)
		r := Product{}
		waitgroup.Add(1)      //计数器+1
		processLine(line, &r) // 提取详情页面数据
		data_arr = append(data_arr, r)
	}
	waitgroup.Wait() //进行阻塞等待 如果 队列不跑完 一直不终止
	fmt.Println("------")
	for _, v := range data_arr {
		sql := buildSql(&v)
		fmt.Println(sql)
		out.WriteString(sql + "\n") // sql 写入文件
	}
	log.Println("end  ")
}

func processLine(line string, r *Product) {
	fmt.Println("---> ", line)
	query, query_err := goquery.NewDocument(line)
	if query_err != nil {
		fmt.Println(query_err)
	}
	title := query.Find("title").Eq(0).Text()
	img := query.Find("div img").Eq(1)
	imgUrl, _ := img.Attr("src")
	fmt.Println(imgUrl)

	video := query.Find("video").Eq(0)
	source := video.Find("source").Eq(0)
	videoUrl, _ := source.Attr("src")

	r.Title = strings.Split(title, "-")[0]

	category := query.Find("div div div").Eq(0).Text()
	//desc := query.Find("div.ui-page div div:nth-child(3)").Eq(0).Text()
	desc := query.Find("div div div").Eq(2).Text()
	//fmt.Println("desc", desc)
	r.Img = imgUrl
	r.Url = strings.TrimSpace(line)
	r.Video = videoUrl
	r.Desc = strings.Replace(strings.TrimSpace(desc), "\n", "\t", -1)
	r.Category = strings.TrimSpace(category)
	r.ProductCode = GetBetweenStr(line, "/id/", "/factoryId")

	waitgroup.Done()
}

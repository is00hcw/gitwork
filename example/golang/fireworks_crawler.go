package main

import (
	"fmt"
	"github.com/PuerkitoBio/goquery"
	"log"
	"os"
	"strings"
	"sync"
	"time"
)

type Product struct {
	Title string //标题
	Img   string //图片地址
	Url   string //访问链接
}

var waitgroup sync.WaitGroup

func main() {
	var (
		url         string = "http://www.fwmall.com.cn/index.php/ProductFectoryMobileWeixin/list/factoryId/26/userClassId/229/boreSizeId/0/stdClass/1"
		server_base string = "http://www.fwmall.com.cn"
	)
	//使用 goquery 创建 dom 对象
	query, query_err := goquery.NewDocument(url)
	if query_err != nil {
		fmt.Println(query_err)
	}

	f, err1 := os.OpenFile("path.txt", os.O_RDWR|os.O_CREATE, os.ModePerm) //可读写，追加的方式打开（或创建文件）
	if err1 != nil {
		panic(err1)
		return
	}
	//defer f.Close()
	defer func() {
		time.Sleep(time.Duration(1 * time.Second))
		f.Sync()
		f.Close()
	}()

	data_arr := make([]Product, 0)
	query.Find("div#thelist ul").Eq(0).Find("li").Each(func(i int, s *goquery.Selection) {
		a := s.Find("a").Eq(0)

		r := Product{}
		//获取对应 跳转链接
		r.Url, _ = a.Attr("href")
		r.Url = server_base + r.Url

		img := a.Find("img").Eq(0)
		r.Img, _ = img.Attr("src")

		table := a.Find("table").Eq(0)
		r.Title = strings.TrimSpace(table.Text())

		fmt.Println(r.Url, r.Img, r.Title)
		data_arr = append(data_arr, r)
		title := strings.Replace(r.Title, "\n", "\t", -1)

		f.WriteString(r.Url + "," + r.Img + "," + title + "\n")
	})
	fmt.Println("---------- ", len(data_arr))

	waitgroup.Add(1) //计数器+1 可以认为是队列+1
	parseDetailPage(data_arr[0])
	waitgroup.Wait() //进行阻塞等待 如果 队列不跑完 一直不终止
	//for k, v := range data_arr {
	//	fmt.Println(k, v)
	//}
	log.Println("end  ")
}

func parseDetailPage(product Product) {
	fmt.Println("---> ", product.Url)
	query, query_err := goquery.NewDocument("http://www.fwmall.com.cn/index.php/ProductFectoryMobileWeixin/detail/id/5755/factoryId/26/userClassId/229/boreSizeId/0")
	if query_err != nil {
		fmt.Println(query_err)
	}

	img := query.Find("div img").Eq(1)
	imgUrl, _ := img.Attr("src")
	fmt.Println(imgUrl)

	video := query.Find("video").Eq(0)
	source := video.Find("source").Eq(0)
	videoUrl, _ := source.Attr("src")
	fmt.Println(videoUrl)

}

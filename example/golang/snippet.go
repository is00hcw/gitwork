runtime.GOMAXPROCS(runtime.NumCPU())

FilePermMode = os.FileMode(0664) // 新建文件默认权限
time.Sleep(5 * time.Second)

func (hs *headerSorter) Less(i, j int) bool {
	return bytes.Compare([]byte(hs.Keys[i]), []byte(hs.Keys[j])) < 0
}

// GMT location
var gmtLoc = time.FixedZone("GMT", 0)

// NowRFC1123 returns now time in RFC1123 format with GMT timezone,
// eg. "Mon, 02 Jan 2006 15:04:05 GMT".
func nowRFC1123() string {
	return time.Now().In(gmtLoc).Format(time.RFC1123)
}

uri := fmt.Sprintf("/machinegroups/%v/machines", m.Name)
err = fmt.Errorf("%v:%v", errMsg.Code, errMsg.Message)

//--------------------------------
brr := [10]int{1, 2, 3, 4, 5, 6, 7}   //数组的初始化  
headers := make(map[string]string)
m3 := map[string]string{  
    "a": "aa",  
    "b": "bb",  
}  

func twoSum(a []int, target int) []int {
	m := make(map[int]int, len(a))
	for i, v := range a {
		if j, exists := m[target-v]; exists {
			return []int{j, i}
		}
		m[v] = i
	}

	return []int{}
}
//--------------------------------
reader := bytes.NewReader(body)
urlStr := fmt.Sprintf("https://%v.%v%v", project.Name, project.Endpoint, uri)
req, err := http.NewRequest(method, urlStr, reader)
for k, v := range headers {
	req.Header.Add(k, v)
}
if glog.V(1) {
	dump, e := httputil.DumpRequest(req, true)
	if e != nil {
		glog.Info(e)
	}
	glog.Infof("HTTP Request:\n%v", string(dump))
}
resp, err := http.DefaultClient.Do(req)
if glog.V(1) {
	dump, e := httputil.DumpResponse(resp, true)
	if e != nil {
		glog.Info(e)
	}
	glog.Infof("HTTP Response:\n%v", string(dump))
}
//--------------------------------
func readBody(body io.ReadCloser) (string, error) {
	data, err := ioutil.ReadAll(body)
	body.Close()
	if err != nil {
		return "", err
	}
	return string(data), nil
}

result, _ := ioutil.ReadAll(r.Body)
r.Body.Close()
json.Unmarshal([]byte(result), c)

contents, err := ioutil.ReadFile(filePath)
ioutil.WriteFile(filePath, contents, FilePermMode)


fd, err := os.OpenFile(tempFilePath, os.O_CREATE|os.O_TRUNC|os.O_WRONLY, FilePermMode)
if err != nil {
	return err
}
// 存储数据到文件
_, err = io.Copy(fd, result.Response.Body)
fd.Close()


func isFileExist(filename string) (bool, error) {
	_, err := os.Stat(filename)
	if err != nil && os.IsNotExist(err) {
		return false, nil
	} else if err != nil {
		return false, err
	} else {
		return true, nil
	}
}
//--------------------------------
var job string
flag.Usage = func() { }
flag.StringVar(&job, "job", "", "job name to record the progress")
flag.Parse()

var once sync.Once
var fetchTasks chan func()
fetchWaitGroup := sync.WaitGroup{}

func doFetch(tasks chan func()) {
	for {
		task := <-tasks
		task()
	}
}

once.Do(func() {
	fetchTasks = make(chan func(), worker)
	for i := 0; i < worker; i++ {
		go doFetch(fetchTasks)
	}
})
fetchWaitGroup.Add(1)
fetchTasks <- func() {
	defer fetchWaitGroup.Done()
}
//wait for all the fetch done
fetchWaitGroup.Wait()

//--------------------------------
//scan each line and add task
bReader := bufio.NewScanner(fh)
bReader.Split(bufio.ScanLines)
for bReader.Scan() {
	line := strings.TrimSpace(bReader.Text())
	if line == "" {
		continue
	}

	items := strings.Split(line, "\t")
}

tempFile, err = ioutil.TempFile(os.TempDir(), TempFilePrefix)
if tempFile != nil {
	io.Copy(tempFile, body)
	tempFile.Seek(0, os.SEEK_SET)
}
//--------------------------------
name := runtime.GOOS
machine := runtime.GOARCH
if out, err := exec.Command("uname", "-s").CombinedOutput(); err == nil {
	name = string(bytes.TrimSpace(out))
}

//--------------------------------
js, _ := json.Marshal(cpb)
sum := md5.Sum(js)
b64 := base64.StdEncoding.EncodeToString(sum[:])

var start int64
start, err = strconv.ParseInt(startStr, 10, 64)
valSlice := strings.Split(rStr, "-")

//--------------------------------
h := hmac.New(func() hash.Hash { return sha1.New() }, []byte(conn.config.AccessKeySecret))
io.WriteString(h, signStr)
signedStr := base64.StdEncoding.EncodeToString(h.Sum(nil))

buf, _ := ioutil.ReadAll(body)
sum := md5.Sum(buf)
b64 = base64.StdEncoding.EncodeToString(sum[:])
reader = bytes.NewReader(buf)

//--------------------------------
// GetNowSec returns Unix time, the number of seconds elapsed since January 1, 1970 UTC.
// 获取当前时间，从UTC开始的秒数。
func GetNowSec() int64 {
	return time.Now().Unix()
}

// GetNowGMT 获取当前时间，格式形如"Mon, 02 Jan 2006 15:04:05 GMT"，HTTP中使用的时间格式
func GetNowGMT() string {
	return time.Now().UTC().Format(http.TimeFormat)
}


//--------------------------------
w http.ResponseWriter
b, err := json.Marshal(c)
if err != nil {
	fmt.Fprintf(w, "%s\n", err.Error())
	return
}
fmt.Fprintf(w, "%s\n", string(b))

//--------------------------------
func glogFlush(period time.Duration) {
    for range time.Tick(period) {
        glog.Flush()
    }
}

//--------------------------------
var (
	Stderr io.Writer = os.Stderr // Stderr is the io.Writer to which executed commands write standard error.
	Stdout io.Writer = os.Stdout // Stdout is the io.Writer to which executed commands write standard output.
)

// runCmd run command opens a new browser window pointing to url.
func runCmd(prog string, args ...string) error {
	cmd := exec.Command(prog, args...)
	cmd.Stdout = Stdout
	cmd.Stderr = Stderr
	return cmd.Run()
}

func handleSignals() {
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, os.Kill)
	<-c
}

from flask import Flask
from redis import Redis
app = Flask(__name__)
redis = Redis(host='120.25.129.150', port=6379)
@app.route('/')
def hello():
redis.incr('hits')
return 'Hello World! I have been seen %s times.' % redis.get('hits')
if __name__ == "__main__":
   app.run(host="0.0.0.0", debug=True)
#!flask/bin/python
from flask import Flask, jsonify

# http://xhrwang.me/2014/12/13/restful-api-by-flask.html

app = Flask(__name__)

@app.route('/')
def index():
    return "Hello, World!"

tasks = [
    {
        'id': 1,
        'title': u'Buy groceries',
        'description': u'Milk, Cheese, Pizza, Fruit, Tylenol', 
        'done': False
    },
    {
        'id': 2,
        'title': u'Learn Python',
        'description': u'Need to find a good Python tutorial on the web', 
        'done': False
    }
]

@app.route('/tasks', methods=['GET'])
def get_tasks():
    return jsonify({'tasks': tasks})
	
if __name__ == '__main__':
    app.run(debug=True)
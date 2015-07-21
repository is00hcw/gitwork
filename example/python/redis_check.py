import redis
# http://debugo.com/python-redis/

r = redis.Redis(host='localhost',port=6379,db=0)
r.set('guo','shuai')

print r.get('guo') ,'\n'

print r.keys()  ,'\n'
print r.dbsize()  ,'\n'
print r.delete('guo')  ,'\n'

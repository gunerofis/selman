"""Hazırlanan kayıtları çalışan yerel servise aktarır; yeniden çağrı çoğaltmaz."""
from pathlib import Path
import http.cookiejar, json, urllib.request

def main():
    root=Path(__file__).resolve().parent
    seed=json.loads((root/'guner_transfer_seed.json').read_text(encoding='utf-8'))
    base='http://127.0.0.1:4196'
    client=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
    session=json.load(client.open(base+'/api/session'))
    current=json.load(client.open(base+'/api/guner-transfer'))
    def post(body):
        request=urllib.request.Request(base+'/api/guner-transfer-save',data=json.dumps(body,ensure_ascii=False).encode(),headers={'Content-Type':'application/json','Origin':base,'X-CSRF':session['csrf']})
        return json.load(client.open(request))
    if not current['resources']:
        current=post({'operation':'area','revision':current['revision'],'resources':seed['resources'],'agentNotes':seed['agentNotes']})
    result=post({'operation':'import','items':seed['items']})
    print(json.dumps({'kalan':sum(i['status']!='done' for i in result['items']),'biten':sum(i['status']=='done' for i in result['items'])},ensure_ascii=False))

if __name__=='__main__':
    main()

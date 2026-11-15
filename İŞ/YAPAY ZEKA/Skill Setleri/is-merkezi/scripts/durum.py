"""Tek seferlik, salt okunur iş/sayaç tutarlılığı kontrolü."""
import argparse,http.cookiejar,json,urllib.request
from urllib.parse import urlsplit

def check(base):
    address=urlsplit(base)
    if address.scheme!='http' or address.hostname!='127.0.0.1' or address.path not in ('','/'):
        raise ValueError('Yalnız yerel İş Merkezi adresi kullanılabilir.')
    client=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
    def read(path):
        with client.open(base.rstrip('/')+'/api/'+path,timeout=10) as response:return json.load(response)
    read('session');jobs=read('jobs');state=read('agent-status')
    if any('status' not in job or 'parentId' not in job for job in jobs):
        raise ValueError('Servis bu iş modeliyle henüz güncellenmemiş.')
    roots=[job for job in jobs if not job['parentId']]
    counts={'active':sum(j['status'] in ('active','needs_user') for j in roots),
            'needs_user':sum(j['status']=='needs_user' for j in roots),
            'completed':sum(j['status']=='completed' for j in roots),
            'cancelled':sum(j['status']=='cancelled' for j in roots)}
    if counts!=state.get('counts'):raise ValueError('Kontrol sonucu ve iş sayıları uyuşmuyor.')
    return {'durum':'Doğrulandı','anaIs':len(roots),'altIs':len(jobs)-len(roots),'sayilar':counts}

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--url',default='http://127.0.0.1:4196');args=parser.parse_args()
    print(json.dumps(check(args.url),ensure_ascii=False))

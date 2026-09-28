import re,json,html
def inline(s):
    s=html.escape(s,quote=False)
    s=re.sub(r'\*\*(.+?)\*\*',r'<strong>\1</strong>',s)
    s=re.sub(r'\[(.+?)\]\((.+?)\)',r'<a href="\2">\1</a>',s)
    s=re.sub(r'`(.+?)`',r'\1',s)
    return s
def md(t):
    out=[];lst=None;para=[]
    def fl():
        nonlocal para
        if para: out.append('<p>'+inline(' '.join(para))+'</p>'); para=[]
    for line in t.split('\n'):
        l=line.rstrip()
        m=re.match(r'^(#{2,4}) (.*)',l); li=re.match(r'^(?:[-*]|\d+\.) (.*)',l)
        if m or li or not l.strip():
            fl()
        if not li and lst: out.append('</%s>'%lst); lst=None
        if m: lv=len(m.group(1)); out.append(f'<h{lv}>{inline(m.group(2))}</h{lv}>')
        elif li:
            k='ol' if re.match(r'^\d',l) else 'ul'
            if not lst: out.append('<%s>'%k); lst=k
            out.append('<li>'+inline(li.group(1))+'</li>')
        elif l.strip(): para.append(l.strip())
    fl()
    if lst: out.append('</%s>'%lst)
    return '\n'.join(out)
def meta(f,k):
    m=re.search(r'^\| '+re.escape(k)+r' \| `(.+?)`',open(f).read(),re.M)
    return m.group(1).replace('\\|','|') if m else ''
pages=[]
tpl={'about':'about','book-a-fitting':'book-a-fitting','contact':'contact','faq':'faq','gallery':'gallery','services':'services','shipping':'','warranty-returns':''}
for h,t in tpl.items():
    f=h+'.md'; txt=open(f).read(); body=txt.split('\n---\n')[-1]
    pages.append({'handle':h,'title':meta(f,'Title'),'templateSuffix':t,'body':md(body),'seo':[meta(f,'SEO title'),meta(f,'SEO description')]})
for mk in ['bmw','audi','mercedes-benz','volkswagen']:
    f=f'car-make-{mk}.md'
    pages.append({'handle':meta(f,'URL handle'),'title':meta(f,'Title'),'templateSuffix':'car-make','body':'','seo':[meta(f,'Title')+' in Dublin | MG Car Audio','']})
svc=[('carplay-installation','CarPlay & Android Auto Installation','service'),('screen-upgrades','Screen Upgrades','service-screens'),('android-radio-fitting','Android Radio Fitting','service-android-radio'),('sound-upgrades','Sound Upgrades','service-sound'),('subwoofers-amplifiers','Subwoofers & Amplifiers','service-sound'),('dash-cam-fitting','Dash Cam Fitting','service-cameras'),('reverse-camera-fitting','Reverse Camera Fitting','service-cameras'),('japanese-import-conversion','Japanese Import Conversion','service-conversion'),('car-radio-repairs','Car Radio Repairs & Codes','service-repairs'),('get-a-quote','Get a Quote','quote')]
for h,t,s in svc: pages.append({'handle':h,'title':t,'templateSuffix':s,'body':'','seo':[t+' in Dublin 12 | MG Car Audio','']})
json.dump(pages,open('/tmp/pages.json','w'))
for p in pages: print(p['handle'],'|',p['title'],'|',p['templateSuffix'],len(p['body']),p['seo'][0][:40])

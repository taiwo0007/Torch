import csv,json,collections
rows=list(csv.DictReader(open('products.csv')))
prods=collections.OrderedDict()
for r in rows:
    prods.setdefault(r['URL handle'],[]).append(r)
out=[]
MF={'car_make':('Car make (product.metafields.custom.car_make)','list.single_line_text_field'),
    'car_model':('Car model (product.metafields.custom.car_model)','list.single_line_text_field'),
    'screen_size':('Screen size (product.metafields.custom.screen_size)','single_line_text_field'),
    'fitted_price':('Fitted price (product.metafields.custom.fitted_price)','single_line_text_field')}
for h,rs in prods.items():
    f=rs[0]
    optnames=[f[f'Option{i} name'] for i in (1,2,3) if f[f'Option{i} name']]
    vrows=[r for r in rs if r['Price']]
    variants=[];optvals=[[] for _ in optnames]
    for r in vrows:
        ov=[]
        for i,n in enumerate(optnames):
            v=r[f'Option{i+1} value']; ov.append({'optionName':n,'name':v})
            if v not in optvals[i]: optvals[i].append(v)
        if not optnames: ov=[{'optionName':'Title','name':'Default Title'}]
        v={'optionValues':ov,'price':r['Price'],'sku':r['SKU'] or None,
           'taxable':r['Charge tax'].upper()=='TRUE',
           'inventoryPolicy':'CONTINUE' if r['Continue selling when out of stock']=='CONTINUE' else 'DENY',
           'inventoryItem':{'tracked':False,'requiresShipping':r['Requires shipping'].upper()=='TRUE'}}
        if r['Compare-at price']: v['compareAtPrice']=r['Compare-at price']
        if r['Weight value (grams)']: v['inventoryItem']['measurement']={'weight':{'value':float(r['Weight value (grams)']),'unit':'GRAMS'}}
        variants.append(v)
    popts=[{'name':n,'values':[{'name':x} for x in optvals[i]]} for i,n in enumerate(optnames)] or [{'name':'Title','values':[{'name':'Default Title'}]}]
    files=[{'originalSource':r['Product image URL'],'alt':r['Image alt text'],'contentType':'IMAGE'} for r in sorted([r for r in rs if r['Product image URL']],key=lambda r:int(r['Image position'] or 99))]
    mfs=[]
    for k,(col,t) in MF.items():
        val=f[col].strip()
        if not val: continue
        if t.startswith('list'): val=json.dumps([x.strip() for x in val.replace('\n',',').split(',') if x.strip()])
        mfs.append({'namespace':'custom','key':k,'type':t,'value':val})
    p={'title':f['Title'],'handle':h,'descriptionHtml':f['Description'],'vendor':f['Vendor'],'productType':f['Type'],
       'tags':[t.strip() for t in f['Tags'].split(',') if t.strip()],'status':'ACTIVE',
       'productOptions':popts,'variants':variants,'files':files,'metafields':mfs,
       'giftCard':f['Gift card'].upper()=='TRUE'}
    if f['SEO title'] or f['SEO description']: p['seo']={'title':f['SEO title'],'description':f['SEO description']}
    out.append(p)
json.dump(out,open('/tmp/products.json','w'))
print(len(out),sum(len(p['variants']) for p in out),sum(len(p['files']) for p in out),len(json.dumps(out)))
print([p['handle'] for p in out if p['giftCard']])

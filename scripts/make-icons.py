# 用法：把 1024x1024 的 PNG 放到 assets/icon-source.png，執行 python3 scripts/make-icons.py
from PIL import Image
im=Image.open('assets/icon-source.png').convert('RGB')
for n in (180,192,512): im.resize((n,n),Image.LANCZOS).save(f'public/icon-{n}.png')
print('done')

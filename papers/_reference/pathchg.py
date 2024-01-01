#
#  pathchg.py
#
#  Copyrighted by Tien-Tsin Wong
#
#  A small tool to replace a substring in files within current folder.
#


import glob

from   parse            import *
from   pprint           import pprint



def replace_string(htmlfile, src, dest):    
    print ('Loading %s ...' % htmlfile)
    with open(htmlfile, 'rt') as f:
        html = f.readlines()

    out_html = []
    for line in html:
        line = line.replace(src, dest)                                
        out_html.append(line)
        
    print ('Writing %s ...\n\n-----------------------------------------\n' % htmlfile)
    with open(htmlfile, 'w') as f:
        f.writelines(out_html)

    
    
if __name__ == "__main__":    

    filelist = glob.glob('*.html')
    pprint (filelist)    
    for html in filelist:
        replace_string(html, '<a href="./papers/', '<a href="/papers/')
    

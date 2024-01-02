#
#  pathchg.py
#
#  Copyrighted by Tien-Tsin Wong
#
#  A small tool to replace a substring in files within current folder.
#


import glob
import sys

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

    n = len(sys.argv)    
    if n == 3:
        src = sys.argv[1]
        des = sys.argv[2]
    else:
        src = '<a href="./papers/'
        des = '<a href="/papers/'
        
    print ('Replacing [%s] ---> [%s]' % (src, des))
    filelist = glob.glob('*.html')
    pprint (filelist)    
    for html in filelist:
        replace_string(html, src, des)
    print ('Completed')
    

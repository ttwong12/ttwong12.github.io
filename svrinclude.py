#
#  svrinclude.py
#
#  Copyrighted by Tien-Tsin Wong
#
#  A small tool to replace the server-side include statement inside
#  .html file and actually insert the content of included html files
#  into the target .html file.
#
#  Only .svrinc.html files will be processed.
#  The program will recursively look into subfolders to .svrinc.html
#  If the input file is "abc.svrinc.html", the output file will be
#  "abc.html".
#


import glob

from   parse            import *
from   pprint           import pprint



def insert_server_side_include(htmlfile):    
    print ('Loading %s ...' % htmlfile)
    with open(htmlfile, 'rt') as f:
        html = f.readlines()

    out_html = []
    for line in html:
        svr_phrase = '<!--#include virtual="{incfile}"-->'
        fields = parse('{dontcare1}'+svr_phrase+'{dontcare2}', line)
        if fields == None:
            fields = parse(svr_phrase+'{dontcare2}', line)        
        if fields != None:
            incfile = fields['incfile']            
            try:
            #if True:
                with open(incfile,'rt') as g:
                    content = g.read()
                content += '\n\n<!----------------------------------------------------------------------------------------------------->\n'
                svr_phrase = svr_phrase.replace('{incfile}', incfile)
                #print ('Replacing \n%s by\n %s' %(svr_phrase, content))
                print ('Replacing %s' %(svr_phrase))
                line = line.replace(svr_phrase, content)                                
            #else:
            except:
                print ('Skipping %s ...' % incfile)        
        out_html.append(line)
    
    outhtmlfile = htmlfile.replace('.svrinc','')
    print ('Writing %s ...\n\n-----------------------------------------\n' % outhtmlfile)
    with open(outhtmlfile, 'w') as f:
        f.writelines(out_html)
    
    
if __name__ == "__main__":    

    svrinc_list = glob.glob('*.svrinc.html')
    for html in svrinc_list:
        insert_server_side_include(html)
    

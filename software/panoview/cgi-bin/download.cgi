#!/usr/local/bin/perl5

require("cgi-lib.cgi");
use Socket; 

&ReadParse(*input);

# Spawn the download process
print &PrintHeader;
print "Downloading ...";
print "<MEtA http-equiv='REFRESH' content='1;url=http://www.cse.cuhk.edu.hk/~ttwong/demo/panoview/panoview-install.zip'>";


# Write a record to log file
$file = <./panoview-download.csv>;
open(fh, ">>$file");

# Lookup the hostname using IP
@t=split(/\./,$ENV{'REMOTE_ADDR'}); 
$e = pack('C4',@t);
$h = gethostbyaddr($e, AF_INET);
print fh "$h,";

# REMOTE_HOST is usually null
# print fh "$ENV{'REMOTE_HOST'},";


print fh "$ENV{'REMOTE_ADDR'}:";
print fh "$ENV{'REMOTE_PORT'},";
$date = time; 
($sec, $min, $hour, $mday, $mon, $year, $wday, $yday, $isdst) = localtime ($date); 
$mon++; 
$year=$year+1900;
if ($min < 10) { $min = "0$min"; } 
if ($sec < 10) { $sec = "0$sec"; } 
if ($mday < 10) { $min = "0$mday"; } 

print fh "$mday/$mon/$year,$hour:$min:$sec\n";

close(fh);
exit;


#!/usr/bin/python3
from collections import OrderedDict
import requests
from bs4 import BeautifulSoup
import json
import pprint

def pull_down(page):
	r=requests.get(page)
	return r.text	

def img_check(element):
	if element.find('img'):
		return True
	else:
		return False

def soup_check(page, thearray):
	soup = BeautifulSoup(thearray[page], "lxml")
	table = soup.find_all('table', {"class": "wikitable"})
	newsoup = BeautifulSoup(str(table), "lxml")
	headers=[]
	for item in newsoup.findAll('th'): 
		headers.append(item.text)

	fatherlist=[]
	fatherlist.append(page)
	for row in newsoup.find_all('tr'):
		sonlist = []
		for cell in row('td'):
			if img_check(cell):
				sonlist.append(cell.img.get('src'))
			else:
				sonlist.append(cell.text)
		
		sonlist = dict(zip(headers,sonlist))
		fatherlist.append(sonlist)


	pp=pprint.PrettyPrinter(indent=4)
	pp.pprint(fatherlist)
		

def main():
	results={}
	
	pages=["https://en.wikipedia.org/w/index.php?title=List_of_even-toed_ungulates_by_population&action=render",
	"https://en.wikipedia.org/w/index.php?title=List_of_odd-toed_ungulates_by_population&action=render",
	"https://en.wikipedia.org/w/index.php?title=List_of_carnivorans_by_population&action=render",
	"https://en.wikipedia.org/w/index.php?title=List_of_bats_by_population&action=render",
	"https://en.wikipedia.org/w/index.php?title=List_of_cetacean_species&action=render",
	"https://en.wikipedia.org/w/index.php?title=List_of_primates_by_population&action=render"]
	
	for page in pages:
		result = pull_down(page)
		results[page]=result
	
	for entry in results:
		soup_check(entry,results)

main()	

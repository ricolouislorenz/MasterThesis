TEXFILES= *.tex
FILE=thesis

pdf: $(FILE).tex

	latexmk -pdf $(FILE).tex

clean:
	rm -f $(FILE).dvi *.aux *~ */*~ *.bbl *.blg *.lof *.log *.lot *.toc *.lol *.out *.tdo *.algorithmic *.loa *.exp *.idx *.nlo *.fdb_latexmk *.fls *.ilg *.ind
	rm -f $(FILE).ps $(FILE).pdf

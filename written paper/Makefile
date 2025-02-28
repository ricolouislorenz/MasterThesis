# Used to publish the zip on the ITM server
COMMITID=$(shell git rev-parse HEAD)
export COMMITID

zip:
#	@echo $(COMMITID) > itm-thesis-template/VERSION
#	@echo ZIP the Latex project Hash: $(COMMITID)
	zip -9 -r thesis.zip itm-thesis-template;
#	cp itm-thesis-template/thesis-example.pdf .
#	cp itm-thesis-template/images/Logo_Inst_Telematik_cropped.pdf .
#publish:
#	@echo "Publish to the ITM webpage"
#	whoami
#	@echo "Publish to http://media.itm.uni-luebeck.de/people/jenkins/thesis.zip";
#	scp thesis.zip jenkins@itm01.itm.uni-luebeck.de:/www/itm-media/people/jenkins/;
#	@echo "Publish to http://media.itm.uni-luebeck.de/people/jenkins/thesis-example.pdf";
#	scp itm-thesis-template/thesis-example.pdf jenkins@itm01.itm.uni-luebeck.de:/www/itm-media/people/jenkins/;
#	./git-notify

clean:
	@echo "Clean up";
	rm thesis.zip;

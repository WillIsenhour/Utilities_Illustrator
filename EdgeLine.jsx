// EdgeLine - v1.2 
// Will Isenhour - Conder Flag Co
// 4.11.14

// Revision 1.1 - Darkened line color
// Revision 1.2 - Dropped line thickness to 0.25 point

#target illustrator

var docRef = app.activeDocument;
var artboardRef = docRef.artboards;
var layerRef = docRef.layers.add();
layerRef.name = "Edge Layer"

var edgeColor = new CMYKColor();
    edgeColor.cyan = 0;
    edgeColor.magenta = 0;
    edgeColor.yellow = 100;
    edgeColor.black = 0; 
 
for( i=0 ; i<artboardRef.length ; i++ )
{
     var top=artboardRef[i].artboardRect[1];
     var left=artboardRef[i].artboardRect[0];
     var width=artboardRef[i].artboardRect[2]-artboardRef[i].artboardRect[0];
     var height=artboardRef[i].artboardRect[1]-artboardRef[i].artboardRect[3];
     var rect = docRef.pathItems.rectangle (top, left, width, height);
        rect.fillColor = new NoColor();
        rect.strokeColor = edgeColor;
        rect.strokeWidth = 0.25;
        rect.name = "Edge Path";
        rect.locked = true;
}
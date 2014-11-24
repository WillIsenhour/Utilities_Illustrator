// MakeProof - v1.2.9
// Will Isenhour - Conder Flag Co

// v1.0 - 4.15.14

// Update 1.1 - Rounded out PDFSaveOptions to result in 
//              smaller files when proofing large bitmaps.
// 4.22.14

// Update 1.2 - Further tweaked the save settings,
//              and added logic to place landscape-oriented artwork
//              on landscape-oriented proof sheets.
// 4.25.14

// Update 1.2.5 (Addendum)
//              ...also added a check to see whether there is any file open at all,
//              and added a procedure to draw a pale gray line around placed artwork
//              so you can see the edge if something on a white panel needs to be proofed.
// 4.24.14

// Update 1.2.6
//              Utterly minor tweak. Changed an 'if' comparison so that it grabs the 
//              portrait-oriented proof sheet in the case of square artwork.
// 5.12.14    

// Update 1.2.7
//              Added a timestamp to the dimensions label.
// 11.12.14

// Update 1.2.8
//              Prettied the timestamp up.
// 11.13.14

// Update 1.2.9
//              Additional timestamp formatting.
// 11.14.14


#target illustrator

// Used later for some orientation logic
var portrait;

// PDF save options
var proofSave = new PDFSaveOptions();

proofSave.colorDownsampling = 72;
proofSave.colorDownsamplingImageThreshold = 72;
proofSave.colorDownsamplingMethod = DownsampleMethod.BICUBICDOWNSAMPLE;
proofSave.colorCompression = CompressionQuality.JPEGMEDIUM;

proofSave.grayscaleDownsampling = 72;
proofSave.grayscaleDownsamplingImageThreshold = 72;
proofSave.grayscaleDownsamplingMethod = DownsampleMethod.BICUBICDOWNSAMPLE;
proofSave.grayscaleCompression = CompressionQuality.JPEGMEDIUM;

proofSave.monochromeDownsampling = 72;
proofSave.monochromeCompression = MonochromeCompression.MONOZIP;

proofSave.optimization = true;
proofSave.compressArt = true;
proofSave.preserveEditability = true;    
// End PDF save options


// Checks to see if there's a document open
if(documents.length > 0)
{
    // Puts a leash on the artwork you've got open
    var artwork = app.activeDocument    
        
    // I'm attempting to get this to skip the main thread if the word
    // "Untitled" is in the filename, no luck so far. Something for another day.
    // if ( artwork.saved && ( artwork.name.match("Untitled") == null) )

    // Checks to see if your artwork is saved.
    if ( artwork.saved )
    {

        // Grabs the dimensions of the artwork being proofed as well as it's name & location
        var artworkWidth =  artwork.width;
        var artworkHeight = artwork.height;
        var artworkLocation = new File(artwork.fullName);

        // Check the artwork dimensions, then grabs the right type of proof sheet
        // and sets the dimensions appropriately
        if (artworkHeight >= artworkWidth)
        {
            var proofTemplate = new File("//NT001/Jerry's Art/#Miscellaneous/Templates - Proofs/Conder Flag Proof Sheet Vertical.ait");
            var proofWidth =  inchesToPoints(7);
            var proofHeight = inchesToPoints(8.25);
            var portrait = true;
        }
        else
        {
            var proofTemplate = new File("//NT001/Jerry's Art/#Miscellaneous/Templates - Proofs/Conder Flag Proof Sheet Horizontal.ait");
            var proofWidth =  inchesToPoints(9.75);
            var proofHeight = inchesToPoints(5.75);
            var portrait = false;
        }

        // Opens the proof sheet
        var proofSheet = app.open(proofTemplate);
        
        // Grabs the artboard and coordinates
        var artboardRef  = proofSheet.artboards[0];
        var artboardLeft = artboardRef.artboardRect[0]; //x
        var artboardTop  = artboardRef.artboardRect[1]; //y
        
        // Links the artwork into the proof sheet
        var placedArtwork = proofSheet.placedItems.add()
        placedArtwork.file = artworkLocation;
        
        // Resizes artwork based on proportions.
        // Wider artwork gets reduced to the horizonal maximum, taller artwork gets reduced to the vertical maximum.
        // After the first reduction, a check is performed to see if they exceed the maximum in the other direction,
        // and if so, another reduction is performed.
        if ( artworkHeight > proofHeight || artworkWidth > proofWidth ) 
        {        
            if(portrait)
            {
                    scale = (proofHeight / placedArtwork.height) * 100
                    placedArtwork.resize(scale, scale);
                    
                    if (placedArtwork.width > proofWidth)
                    {
                        scale = (proofWidth / placedArtwork.width) * 100;
                        placedArtwork.resize(scale, scale);
                    }
            }
            else
            {
                    scale = (proofWidth / placedArtwork.width) * 100;
                    placedArtwork.resize(scale, scale);

                    if (placedArtwork.height > proofHeight)
                    {
                        scale = (proofHeight / placedArtwork.height) * 100
                        placedArtwork.resize(scale, scale);
                    }

            }      
        }
        
        if(portrait)
        {
            positionArtwork(0);
        }
        else
        {
            // *** Note that the 90pt adjustment in the non-portrait version of this placement statement is a kludge.
            // I have no idea why this calculation would come out 90pt out of whack in both dimensions, but I need to find out.
            positionArtwork(90);
        }

        // Creates the dimensions
        var dimensions = proofSheet.textFrames.add();
        dimensions.position = [ placedArtwork.left, ((placedArtwork.top - placedArtwork.height) - inchesToPoints(0.125)) ];
        dimensions.contents = ( "".concat( (pointsToInches(artworkHeight)).toFixed(2), "\" high x ", (pointsToInches(artworkWidth)).toFixed(2), "\" wide" ) );

        // Creates timestamp
        var timestamp = proofSheet.textFrames.add();
        timestamp.textRange.characterAttributes.size = 7;
        var todaysDate = new Date();
        todaysDate.getDate();
        timestamp.position = [ artboardLeft + inchesToPoints( 0.25 ), artboardTop - inchesToPoints( 1.025 ) ];
        timestamp.contents = ( "".concat(   "Proofed at: ", 
                                            tsHours(todaysDate.getHours()), 
                                            ":", 
                                            tsMinutes(todaysDate.getMinutes()),
                                            tsMeridiam(todaysDate.getHours()),
                                            ", ", 
                                            todaysDate.toDateString() ) );

        // Creates outline around artwork.
        var outline = proofSheet.pathItems.rectangle( placedArtwork.top, placedArtwork.left, placedArtwork.width, placedArtwork.height, false);
        var outlineStroke = new CMYKColor();
            outlineStroke.black = 40;
        var outlineFill =   new NoColor();
        outline.strokeColor = outlineStroke;
        outline.fillColor   = outlineFill;
        outline.name = "Artwork edge";

        // This block adds " - PROOF" to the end of the old file name after stripping the extension
        // and then saves the file under the new name.
        var artLoc = artworkLocation.toString();
        var trimEnd = artLoc.lastIndexOf(".");
        var trimmedFileName = artLoc.substr(0, trimEnd);
        var newFileLocation = new File("".concat(trimmedFileName, " - PROOF.pdf"));
        proofSheet.saveAs(newFileLocation, proofSave);
        
    }
    else
    {
        alert("You need to save this file before running the proof widget.");
    }
}
else
{
    alert("You need to have a file open for any of this to work.");
}



// Centers the placed artwork and bumps it up a touch for the dimension tag. 
// Bear in mind that x0, y0 is the lower lefthand corner.
function positionArtwork(offset)
{
    placedArtwork.position = [ ((proofSheet.width / 2) - (placedArtwork.width / 2) - offset) , 
                               (((proofSheet.height / 2) + (placedArtwork.height / 2)) + inchesToPoints(0.2) + offset)];
}

// Converts inches to points.
function inchesToPoints(i)
{
    var points = i * 72;
    return points;
}

// Converts points to inches.
function pointsToInches(p)
{
    var inches = p / 72;
    return inches;
}


// Timestamp formatting functions
function tsHours(h)
{
    if(h > 12)
    {
        return h - 12;
    }
    else
    {
        return h;
    }
}

function tsMinutes(m)
{
    if (m < 10)
    {
        return "0" + m;
    }
    else
    {
        return m;
    }
}

function tsMeridiam(h)
{
    if (h > 12)
    {
        return "pm";
    }
    else
    {
        return "am";
    }
}
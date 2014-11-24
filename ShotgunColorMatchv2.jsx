// ShotgunColorMatch - v2.0
// Will Isenhour - Conder Flag Co
// 6.19.14

// 2.0 - 
// Major upgrade to the varations of inks tested. Now tests a much broader combination of inks, 
// likely every possible integer variation of the ink array within the min/max range.

#target illustrator


//// VARIABLES, ETC ////

var MIN        = -1;                        // Minimum value in the permutation array
var MAX        = 1;                         // Max value in the permutation array
var inksVaried = [MIN, MIN, MIN, MIN];      // Initializes the array with the minimum values
var range      = getRange(MIN, MAX);        // Determines the range between min and max *Not presently used

var REPS       = 40;                        // This is how many times the main 'for' loop repeats. 
                                            // A comment in front of the main for loop explains why 40 is the magic number

var header     = this.inchesToPoints(1);    // Space allotment for the header

var horizSpace = this.inchesToPoints(5.0);  // Total space allotment for the color chip and the label
var vertSpace  = this.inchesToPoints(0.65);

var horizSize  = this.inchesToPoints(4.8);  // Height and Width of the color chips
var vertSize   = this.inchesToPoints(0.5);

var labelMargin = inchesToPoints(0.005);    // Distance between a color chip and its label

var labelSize = 8;                          // Point size of the color label 


//// MAIN THREAD ////

// Getting test color
var testColor = new CMYKColor();
testColor.cyan    = Number(validateInk("cyan"));
testColor.magenta = Number(validateInk("magenta"));
testColor.yellow  = Number(validateInk("yellow"));
testColor.black   = Number(validateInk("black"));

// Color variation for the test chips in percent
var variance = getVariance();

// Creates the document
var testSheet = app.documents.add(DocumentColorSpace.CMYK, inchesToPoints(50), ( header + ( vertSpace * REPS) ) );

// Creates the original color chip with its label at the top of the page
var originalChip = testSheet.pathItems.rectangle(testSheet.height, 0, horizSize, vertSize, false);
    originalChip.fillColor = testColor;
    originalChip.strokeColor = new NoColor();
var originalColorLabel = testSheet.textFrames.add();
    originalColorLabel.position = [ originalChip.left, (originalChip.top - originalChip.height) - this.inchesToPoints(0.125) ];
    originalColorLabel.contents = ( "Original Color: " +
                                    "C:" + testColor.cyan    + ", " +  
                                    "M:" + testColor.magenta + ", " + 
                                    "Y:" + testColor.yellow  + ", " + 
                                    "K:" + testColor.black   );

// The for loops below create the swatches, position them, and assign colors to them based on the test swatch
//
// With this version, a loop that repeats 40 times gets the ink array one permutation short of "0, 0, 0, 0"
// The zero array will result in ten mixes that are identical to the original color, and every set of color
// variations beyond that point has already been produced in the top half of the permutation set
//
// I'd love to find a more elegant way to do this than just kludging "40" into this spot, but nothing comes to mind right now.
for (i = 0; i < REPS; i++)
{
    
    for (j = 0; j < 11; j++)
    {
        
        // Skips this operation for loop 5 since all the colors it produces during that cycle would be the same as the original color.
        if (j != 5)
        {
            // Imports the test color and varies it according to the 
            // values in inksVaried[] and the iteration of the loop 
            var chipColor = new CMYKColor();

            // The inksVaried array is now altered directly by the permutateInks() method
            chipColor.cyan    = this.limiter(testColor.cyan +    ((inksVaried[0] * variance) * (j - 5)));
            chipColor.magenta = this.limiter(testColor.magenta + ((inksVaried[1] * variance) * (j - 5)));
            chipColor.yellow  = this.limiter(testColor.yellow +  ((inksVaried[2] * variance) * (j - 5)));
            chipColor.black   = this.limiter(testColor.black +   ((inksVaried[3] * variance) * (j - 5)));


            // Creates the chip at a specific position and applies the fill and stroke color to it,
            // also shifts each chip one "chip width" to the left above loop five.
            if (j < 5)
            {
                var chip = testSheet.pathItems.rectangle( ((testSheet.height - header) - i * vertSpace), j * horizSpace, horizSize, vertSize, false);
            } 
            else 
            {
                var chip = testSheet.pathItems.rectangle( ((testSheet.height - header) - i * vertSpace), j * horizSpace - horizSpace, horizSize, vertSize, false);
            }
            chip.fillColor = chipColor;
            chip.strokeColor = new NoColor();
            
            // Builds the label for each color chip
            var colorLabel = testSheet.textFrames.add();
            colorLabel.textRange.characterAttributes.size = labelSize;
            colorLabel.position = [ chip.left, (chip.top - chip.height) - labelMargin ];
            colorLabel.contents = ( "C:" + chipColor.cyan    + ", " +  
                                    "M:" + chipColor.magenta + ", " + 
                                    "Y:" + chipColor.yellow  + ", " + 
                                    "K:" + chipColor.black   
                                
                                   // Debug code. Prints the values of the 
                                   // inksVaried array behind the color label
                                   /*    
                                    + "      " + "Array = " +
                                    inksVaried[0].toString() + " " +
                                    inksVaried[1].toString() + " " +
                                    inksVaried[2].toString() + " " +
                                    inksVaried[3].toString() 
                                   */
                            
                                   );
                                
        }
    }
    permutateInks(inksVaried, MIN, MAX);
}


//// HERE BE FUNCTIONS //// ---------------------------------------------------------------

// Converts inches to points, which Illustrator uses for internal measurements
function inchesToPoints(i)
{
    var points = i * 72;
    return points;
}

// Converts points to inches
function pointsToInches(p)
{
    var inches = p / 72;
    return inches;
}

// Used internally in the color chip calculations
// Makes sure any calculated values are with the acceptable range for CMYK values
function limiter(i)
{
    if (i > 100)
    {
        return 100;
    } 
    else if (i < 0)
    {
        return 0;
    }
    else
    {
        return i;    
    }    
}

// This prompts the user for the percentage of variation they want to see in each step of color testing
function getVariance()
{
    var input;
    
    do 
    {
        input = prompt("Enter the percentage of ink variation for this test.\n" +
                       "Each test swatch has one or several inks (CMY or K) altered by this amount during the test." + 
                       "A value between 1 and 3 is reasonable.", 1);
                       
        if (input <= 0 || input > 100 || isNaN(input))
        {
            alert("That's an invalid entry. Don't enter letters, entering a 0 is pointless.");
        }
    } 
    while (input <= 0 || input > 100 || isNaN(input))

    return input;
    
}

// Prompts the user for individual CMYK values to build the test color.
function validateInk(inkColor)
{
    var input;
    
    do 
    {
        input = prompt("Enter the percentage of " + inkColor + " ink for the test color.\n" +
                       "Your value should be between 0 and 100.", 0);
                       
        if (input < 0 || input > 100 || isNaN(input))
        {
            alert("That's an invalid entry. Enter a number between 0 and 100, no letters.");
        }
    } 
    while (input < 0 || input > 100 || isNaN(input))

    return input;
}

// Returns the steps between two numbers, and counts both 'n' and 'x' as a step
// * Presently called once but the result is never used
function getRange(n, x)
{
    return abs(n - x);
}

// Counts upward through an array with an arbitrary minimum (n) and maximum (x) value
// The idea is to generate every combination of numbers possible in the array (inksArray) within
// the given range of min (n) and max (x), in this case, -1 and 1.
function permutateInks(inksArray, n, x)
{
    var updated = false;
    var i       = 0;
        
    do 
    {
        if (inksArray[i] != x)
        {
            inksArray[i]++;
            if (i > 0)
            {
                for (j = i - 1; j > -1; j--)
                {
                    inksArray[j] = n;
                }
            }
            updated = true;
        }    
        i++;
    } while (updated == false);
    
}

Utilities_Illustrator
-----------------------------------------------------------------------------
This is a collection of utilities for Adobe Illustrator on Windows. 
They were written in JavaScript and are presently in use on Illustrator CS5+.
All contents of this directory (C) Will Isenhour unless noted otherwise. 11/24/2014


EdgeLine -
Draws a fine yellow line around the perimeter of every artboard in a document,
intended for indicating cut lines around the edges of printed artwork.

HemLabel - 
Intended for use after you've added a one-inch turned hem on a banner.
Places a short message or note on the back of all four corners of a banner
in the hem area.
Accepts a simple scale argument (eg 1/2, 1/4, 1/10) for oversized artwork

MakeProof - 
Generates a proofs with dimensions and a timestamp from an open file in Illustrator.
This program won't work outside of my shop without some tinkering.
At present it requires proof sheet templates to be at a hard-coded location on 
the network, otherwise it won't run properly.

ShotgunColorMatchv2 - 
Accepts a swatch in the form of CMYK values plus a step value of n, and then generates
variations of the original color where inks are added or removed in increments of n%. 
Generates every possible combination of positive, neutral, and negative values for
CMYK inks.
Intended for tight spot-color matching in shops bad (or no) color management.

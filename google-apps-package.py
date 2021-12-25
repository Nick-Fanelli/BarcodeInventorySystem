import re

indexFile = open("index.html")

indexContents = ""
cssContent = ""
jsContent = ""

with open("index.html") as f:
    indexContents = f.readlines()

f.close()

# Read the CSS Scripts and the JS Scripts
for line in indexContents:

    line = line.strip()
    
    # Link
    if line.startswith("<link rel=\"stylesheet\""):
        cssFilepath = re.search(r'href=\".*\"', line).group()[6:-1]

        lineContent = None

        with open(cssFilepath) as f:
            lineContent = f.readlines()

        f.close()

        for line in lineContent:
            cssContent += line

        cssContent += "\n"

    elif line.startswith("<script src=\""):
        jsFilepath = re.search(r'src=\".*\"', line).group()[5:-1]

        lineContent = None

        with open(jsFilepath) as f:
            lineContent = f.readlines()

        f.close()

        for line in lineContent:
            if(line.strip() == "const RELEASE_MODE = false;"):
                jsContent += "const RELEASE_MODE = true;"
                continue

            jsContent += line

        jsContent += "\n"

# Reconstruct the file
finalFilecontents = ""
wroteCSS = False
wroteJS = False

for line in indexContents:    

    line = line.strip()

    if line.startswith("<link rel=\"stylesheet\""):
        if(wroteCSS != True):
            finalFilecontents += "<style>" + cssContent + "</style>"
            wroteCSS = True
        continue
    elif line.startswith("<script src=\""):
        if(wroteJS != True):
            finalFilecontents += "<script>" + jsContent + "</script>"
            wroteJS  = True
        continue

    finalFilecontents += line

# Export the final filecontents
outFile = open("packaged-index.html", "w+")
outFile.write(finalFilecontents)
outFile.close()
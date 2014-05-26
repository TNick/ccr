greaterThan(QT_MAJOR_VERSION, 4):QT += widgets webkitwidgets

# Add more folders to ship with the application, here
folder_01.source = ../php
folder_01.target = .
DEPLOYMENTFOLDERS = folder_01

# Define TOUCH_OPTIMIZED_NAVIGATION for touch optimization and flicking
DEFINES += TOUCH_OPTIMIZED_NAVIGATION

# The .cpp file which was generated for your project. Feel free to hack it.
SOURCES += main.cpp

# Please do not modify the following two lines. Required for deployment.
include(html5applicationviewer/html5applicationviewer.pri)
qtcAddDeployment()

OTHER_FILES += \
    ../php/jscript/lib/jquery-1.11.1.js \
    ../php/jscript/lib-debug/jquery-1.11.1.js \
    ../php/jscript/ccr/main.js \
    ../php/jscript/lib/domReady.js \
    ../php/jscript/lib-debug/domReady.js \
    ../php/jscript/ccr/DynResHtml.js \
    ../php/jscript/ccr/DynResImg.js \
    ../php/jscript/ccr/DynResVect.js \
    ../php/jscript/lib-debug/cookies.js

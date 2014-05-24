#include <qwebkitglobal.h>
#include <qwebinspector.h>
#include <QApplication>
#include <QGraphicsWebView>

#include "html5applicationviewer.h"

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);

    Html5ApplicationViewer viewer;
    viewer.setOrientation(Html5ApplicationViewer::ScreenOrientationAuto);
    viewer.showExpanded();

    viewer.webView()->page()->settings()->setAttribute(QWebSettings::DeveloperExtrasEnabled, true);

    QWebInspector inspector;
    inspector.setPage(viewer.webView()->page());
    inspector.setVisible(true);

    viewer.loadFile(QLatin1String("php/index.html"));
    viewer.resize(600, 600);


    return app.exec();
}

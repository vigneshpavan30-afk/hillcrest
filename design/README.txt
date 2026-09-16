Hillcrest Dental Studio — full site redesign
============================================

Files
-----
Hillcrest Redesign.dc.html   Shell: page picker + desktop/phone preview frames. OPEN THIS ONE.
Site Page.dc.html            The website itself — all 19 page templates, 13 services, 12 articles.
image-slot.js                Drag-and-drop image placeholders.
support.js                   Runtime required by both HTML files.

How to open
-----------
Keep all files in the same folder, then open "Hillcrest Redesign.dc.html" in a browser.
"Site Page.dc.html" also opens on its own and navigates normally.

Note: some browsers block local file loads (Chrome with file://). If pages look unstyled,
serve the folder over a local web server instead, e.g.:

    cd hillcrest-redesign
    python3 -m http.server 8000

then visit http://localhost:8000/Hillcrest%20Redesign.dc.html

Pages included
--------------
Home · Services index · Service detail (13 services) · Appointments (4-step booking flow)
New Patients · Insurance & Payment · Who We Are · Meet Dr. Skaf · The Difference
Office Gallery · Patient Reviews · Patient Library · Article (12 articles)
Contact & Directions · Online Forms · Site Map · Accessibility · Thank You · 404

Images
------
Every image is an empty placeholder labelled with what belongs there. Drag an image file
onto a placeholder to fill it; drops are saved next to the HTML file.

Practice details used
---------------------
Hillcrest Dental Studio · Dr. Rana Skaf, DDS
2130 Grand Ave H, Chino Hills, CA 91709 · (909) 927-5333
info@hillcrestdentalstudio.com · Mon-Fri 10:00-6:00, Sat/Sun closed

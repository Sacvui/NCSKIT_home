
$packagesFile = "public/webr_packages/bin/emscripten/contrib/4.5/PACKAGES"
$content = Get-Content $packagesFile -Raw

# GPArotation
$gpaOld = 'Package: GPArotation
Version: 2025.3-1
Depends: R (>= 2.0.0)
Imports: stats
License: GPL (>= 2)
MD5sum: 2df231f33740b3e8cfc6d735d6d5a8ac'

$gpaNew = 'Package: GPArotation
Version: 2025.3-1
Depends: R (>= 2.0.0)
Imports: stats
License: GPL (>= 2)
Built: R 4.5.1; emscripten; 2026-03-29 09:06:28 UTC; unix
Filesize: 548486
SHA256: 2a7bf55adb291cbe6b5a92fad0f01cb693a5964f7794fcca41447883e14c9f23
File: GPArotation_2025.3-1.tgz?sha256=2a7bf55adb291cbe6b5a92fad0f01cb693a5964f7794fcca41447883e14c9f23
MD5sum: 2df231f33740b3e8cfc6d735d6d5a8ac'

$content = $content.Replace($gpaOld, $gpaNew)

# jsonlite
$jsonOld = 'Package: jsonlite
Version: 2.0.0
Depends: methods
Suggests: httr, vctrs, testthat, knitr, rmarkdown, R.rsp, sf
License: MIT + file LICENSE
MD5sum: 21e5d56d9ff868761c194973a18c7d53'

$jsonNew = 'Package: jsonlite
Version: 2.0.0
Depends: methods
Suggests: httr, vctrs, testthat, knitr, rmarkdown, R.rsp, sf
License: MIT + file LICENSE
Built: R 4.5.1; emscripten; 2026-03-29 09:06:28 UTC; unix
Filesize: 383490
SHA256: 921545fc1d4079bcb1bf06022a258dc0966493b1cbe2e3eac852ee2014c9e924
File: jsonlite_2.0.0.tgz?sha256=921545fc1d4079bcb1bf06022a258dc0966493b1cbe2e3eac852ee2014c9e924
MD5sum: 21e5d56d9ff868761c194973a18c7d53'

$content = $content.Replace($jsonOld, $jsonNew)

# mnormt
$mnormtOld = 'Package: mnormt
Version: 2.1.1
Depends: R (>= 2.2.0)
License: GPL-2 | GPL-3
MD5sum: 03c5bfecaa6aee44b1e030ff96fee7cf'

$mnormtNew = 'Package: mnormt
Version: 2.1.1
Depends: R (>= 2.2.0)
License: GPL-2 | GPL-3
Built: R 4.5.1; emscripten; 2026-03-29 09:06:28 UTC; unix
Filesize: 121672
SHA256: 63908d765a2bec28a254fa89820e0bd6890be051d71fdcbb9526860f796e9706
File: mnormt_2.1.1.tgz?sha256=63908d765a2bec28a254fa89820e0bd6890be051d71fdcbb9526860f796e9706
MD5sum: 03c5bfecaa6aee44b1e030ff96fee7cf'

$content = $content.Replace($mnormtOld, $mnormtNew)

# psych
$psychOld = 'Package: psych
Version: 2.5.6
Imports:
        mnormt,parallel,stats,graphics,grDevices,methods,lattice,nlme,GPArotation
Suggests: psychTools, lavaan, lme4, Rcsdp, graph, knitr, Rgraphviz
License: GPL (>= 2)
MD5sum: ece4435f765fb0002daad04424ea0d35'

$psychNew = 'Package: psych
Version: 2.5.6
Imports:
        mnormt,parallel,stats,graphics,grDevices,methods,lattice,nlme,GPArotation
Suggests: psychTools, lavaan, lme4, Rcsdp, graph, knitr, Rgraphviz
License: GPL (>= 2)
Built: R 4.5.1; emscripten; 2026-03-29 09:06:28 UTC; unix
Filesize: 2068281
SHA256: c8e0d72a6fb53421c0648d6b8602119866f5d638a2906b185f24fb35c4121e78
File: psych_2.5.6.tgz?sha256=c8e0d72a6fb53421c0648d6b8602119866f5d638a2906b185f24fb35c4121e78
MD5sum: ece4435f765fb0002daad04424ea0d35'

$content = $content.Replace($psychOld, $psychNew)

# lattice
$latticeOld = 'Package: lattice
Version: 0.22-7
Priority: recommended
Depends: R (>= 4.0.0)
Imports: grid, grDevices, graphics, stats, utils
Suggests: KernSmooth, MASS, latticeExtra, colorspace
Enhances: chron, zoo
License: GPL (>= 2)'

$latticeNew = 'Package: lattice
Version: 0.22-9
Priority: recommended
Depends: R (>= 4.0.0)
Imports: grid, grDevices, graphics, stats, utils
Suggests: KernSmooth, MASS, latticeExtra, colorspace
Enhances: chron, zoo
License: GPL (>= 2)
Built: R 4.5.1; emscripten; 2026-03-29 09:06:28 UTC; unix
Filesize: 883294
SHA256: f360e8639403ff8eedbfdc13a1cc0f057b128afb69f8c5e0adc77d011b4d75b2
File: lattice_0.22-9.tgz?sha256=f360e8639403ff8eedbfdc13a1cc0f057b128afb69f8c5e0adc77d011b4d75b2'

$content = $content.Replace($latticeOld, $latticeNew)

# nlme
$nlmeOld = 'Package: nlme
Version: 3.1-168
Priority: recommended
Depends: R (>= 3.6.0)
Imports: graphics, stats, utils, lattice
Suggests: MASS, SASmixed
License: GPL (>= 2)
MD5sum: 58a7e389a19582d795abc1581ab35cab'

$nlmeNew = 'Package: nlme
Version: 3.1-169
Priority: recommended
Depends: R (>= 3.6.0)
Imports: graphics, stats, utils, lattice
Suggests: MASS, SASmixed
License: GPL (>= 2)
Built: R 4.5.1; emscripten; 2026-03-29 09:06:28 UTC; unix
Filesize: 1724707
SHA256: 236526a377fdc0c0ac031b497c458cde3ebf1911a89847aff426fbe7ad860c31
File: nlme_3.1-169.tgz?sha256=236526a377fdc0c0ac031b497c458cde3ebf1911a89847aff426fbe7ad860c31'

$content = $content.Replace($nlmeOld, $nlmeNew)

Set-Content $packagesFile $content -NoNewline
Write-Host "Successfully patched PACKAGES index with binary metadata."

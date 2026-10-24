# RELEASE CONTROL: the release steps of the AVNI One website (avnione.com / avnione.in), target AVNI-ONE-WEB, chain avni-one-web.
# The "product" is the public site. Installing = pushing the candidate commit to main of github.com/sehgalautoriders/avnione,
# which GitHub Pages serves. The live check = the site serves the candidate's build mark (build.txt, written by tools/check_site.py).
# Built 24-10-2026 on the order of 23-10-2026 ("We need this for avnione.com and avnione.in"), modelled on HeroPages-Release.ps1.
# Run ONLY by Sentinel's tools\avni_release.py release / execute (it refuses without a release ticket).
#
# Phases:
#   build    - the staged candidate is copied to {build}\site (no .git) and checked: tools/check_site.py must pass on that copy
#              (whole pages, every link found, nothing private, build.txt = the mark of the files). A stamp names release, commit, mark.
#   test     - never backwards: the candidate contains the commit GitHub serves now (the first release has none - allowed).
#   snapshot - the commit GitHub serves now is kept in {rc_root}\Rollback\{rc}\live-before.json (pushing it back = the rollback).
#   install  - git push <github> <candidate>:main; GitHub Pages is switched on for main if it is not on yet; a page build is asked
#              for; the installed stamp is written for the pipe's probe.
#   verify   - GitHub reports a 'built' page build of the candidate, and the site serves the candidate's build.txt (no cache).
#   rollback - the earlier commit is pushed back (or, after the very first release, the site is switched off again).
param(
    [Parameter(Mandatory)][ValidateSet('build', 'test', 'snapshot', 'install', 'verify', 'rollback')][string]$Phase,
    [Parameter(Mandatory)][string]$Rc,
    [Parameter(Mandatory)][string]$Staging,
    [Parameter(Mandatory)][string]$Build,
    [Parameter(Mandatory)][string]$Commit,
    [Parameter(Mandatory)][string]$RcRoot,
    [string]$Repo = 'C:\02 - OUR FILES\Access to all drives\AVNI\90 - WORKTREES\Active\WP-0066 - AVNI ONE WEB',
    [string]$GhRepo = 'sehgalautoriders/avnione'
)
if (Test-Path -LiteralPath 'C:\02 - OUR FILES\Access to all drives\AVNI\00 - CONTROL\RELEASE-FREEZE.json') { [Console]::Error.WriteLine("RELEASE FREEZE - refused: $($MyInvocation.MyCommand.Name). Nothing was changed."); exit 4 }
$ErrorActionPreference = 'Stop'
$tools = 'C:\02 - OUR FILES\Access to all drives\AVNI\90 - WORKTREES\Active\WP-0038 - AVNI SENTINEL\tools'
& python (Join-Path $tools 'avni_release.py') check-ticket | Out-Null
if ($LASTEXITCODE -ne 0) { throw "RELEASE CONTROL: no valid release ticket - this script is run by Sentinel's release executor only." }

$Remote  = "https://github.com/$GhRepo.git"
$src     = Join-Path $Staging 'avni-one-web'    # the pipe's detached checkout of the candidate
$siteDir = Join-Path $Build 'site'
$stamp   = Join-Path $Build 'AVNI-ONE-WEB-RELEASE.json'
$rollDir = Join-Path $RcRoot "Rollback\$Rc"
$before  = Join-Path $rollDir 'live-before.json'
$instDir = Join-Path $RcRoot 'Installed'
$instF   = Join-Path $instDir 'AVNI-ONE-WEB.json'
$wall    = Join-Path $tools 'avni_internet.py'

function Internet([int]$mb) {
    & python $wall --app "Release Control AVNI-ONE-WEB $Rc" --need-mb $mb | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "the internet wall said NO - the release waits; nothing pushed" }
}
function GitRetry([string[]]$a, [int]$tries) {
    $out = ''
    for ($i = 0; $i -lt $tries; $i++) {
        $out = & git @a 2>&1 | Out-String
        if ($LASTEXITCODE -eq 0) { return $out }
        Start-Sleep -Seconds 15
    }
    throw "git $($a[0..2] -join ' ') failed after $tries tries: $($out.Trim())"
}
function LiveCommit() {
    # the commit GitHub serves = the tip of main ('' before the first release)
    Internet 1
    $out = GitRetry @('ls-remote', $Remote, 'refs/heads/main') 4
    $m = [regex]::Match($out, '^([0-9a-f]{40})')
    if ($m.Success) { return $m.Groups[1].Value } else { return '' }
}
function SiteUrl([string]$dir) {
    # avnione.com once the CNAME file is in the site (added only after the domain answers); before that the GitHub address
    $cn = Join-Path $dir 'CNAME'
    if (Test-Path -LiteralPath $cn) { return 'https://' + (Get-Content -LiteralPath $cn -Raw).Trim() }
    $owner, $name = $GhRepo.Split('/')
    return "https://$owner.github.io/$name"
}
function Fetch([string]$url, [int]$tries) {
    $last = ''
    for ($i = 0; $i -lt $tries; $i++) {
        try {
            $r = Invoke-WebRequest -Uri ($url + '?rc=' + [guid]::NewGuid().ToString('N')) -Headers @{ 'Cache-Control' = 'no-cache'; 'Pragma' = 'no-cache' } -TimeoutSec 20 -UseBasicParsing
            return [string]$r.Content
        } catch { $last = $_.Exception.Message; Start-Sleep -Seconds 10 }
    }
    throw "the site did not answer at $url ($last)"
}
function Mark() { return (Get-Content -LiteralPath $stamp -Raw | ConvertFrom-Json).mark }

switch ($Phase) {
    'build' {
        if (-not (Test-Path -LiteralPath (Join-Path $src 'index.html'))) { throw "the staged candidate has no index.html ($src)" }
        if (Test-Path $siteDir) { Remove-Item $siteDir -Recurse -Force }
        New-Item -ItemType Directory -Force $siteDir | Out-Null
        robocopy $src $siteDir /E /XD .git /NFL /NDL /NJH /NJS /NC /NS /NP | Out-Null
        if ($LASTEXITCODE -ge 8) { throw "robocopy failed ($LASTEXITCODE)" }
        $out = & python -I (Join-Path $siteDir 'tools\check_site.py') --root $siteDir 2>&1 | Out-String
        Write-Host $out.Trim()
        if ($LASTEXITCODE -ne 0) { throw "the site check failed on the candidate - nothing is released" }
        $m = (Get-Content -LiteralPath (Join-Path $siteDir 'build.txt') -Raw).Trim()
        [ordered]@{ release = $Rc; commit = $Commit; mark = $m; site = (SiteUrl $siteDir); builtAt = (Get-Date -Format 'dd-MM-yyyy HH:mm') } |
            ConvertTo-Json | Set-Content -LiteralPath $stamp -Encoding UTF8
        Write-Host "built: $((Get-ChildItem $siteDir -File -Recurse).Count) files, build mark $m, commit $($Commit.Substring(0, 7))"
    }
    'test' {
        $live = LiveCommit
        if ($live) {
            & git -C $src merge-base --is-ancestor $live $Commit 2>&1 | Out-Null
            if ($LASTEXITCODE -ne 0) { throw "GitHub serves $($live.Substring(0, 7)), which the candidate $($Commit.Substring(0, 7)) does not contain - build the job on top of what is live" }
            Write-Host "tests passed: the candidate contains the live commit $($live.Substring(0, 7)); site check passed at build"
        } else {
            Write-Host "tests passed: first release (GitHub has no main yet); site check passed at build"
        }
    }
    'snapshot' {
        $live = LiveCommit
        New-Item -ItemType Directory -Force $rollDir | Out-Null
        [ordered]@{ release = $Rc; liveCommit = $live; keptAt = (Get-Date -Format 'dd-MM-yyyy HH:mm') } |
            ConvertTo-Json | Set-Content -LiteralPath $before -Encoding UTF8
        if ($live) { Write-Host "rollback point kept: GitHub serves $($live.Substring(0, 7))" } else { Write-Host "rollback point kept: nothing served before (first release)" }
    }
    'install' {
        Internet 20
        $out = GitRetry @('-C', $src, 'push', $Remote, "${Commit}:refs/heads/main") 4
        Write-Host ("  " + $out.Trim())
        # GitHub Pages on: the source is main, the whole repository
        $on = $false
        try { & gh api "repos/$GhRepo/pages" 2>$null | Out-Null; $on = ($LASTEXITCODE -eq 0) } catch {}
        if (-not $on) {
            $body = '{"source":{"branch":"main","path":"/"}}'
            $r = $body | & gh api -X POST "repos/$GhRepo/pages" --input - 2>&1 | Out-String
            if ($LASTEXITCODE -ne 0) { throw "GitHub Pages could not be switched on for $GhRepo : $($r.Trim())" }
            Write-Host "  GitHub Pages switched on (main, /)"
        }
        $asked = ''
        for ($i = 0; $i -lt 4; $i++) {
            try { $asked = (& gh api -X POST "repos/$GhRepo/pages/builds" 2>$null | ConvertFrom-Json).status; if ($asked) { break } } catch {}
            Start-Sleep -Seconds 15
        }
        if (-not $asked) { Write-Host "  note: the page build request was not taken; GitHub builds after the push by itself" }
        Set-Content -LiteralPath (Join-Path $Build 'build-asked-at.txt') -Value (Get-Date).ToUniversalTime().AddMinutes(-2).ToString('o') -Encoding UTF8
        # avnione.in: a tiny second site (tools\avnione-in: index.html + 404.html + CNAME avnione.in) that sends every visitor to the
        # same page on avnione.com. It is pushed here, from this candidate, so it never goes out by hand. Its CNAME claims avnione.in on
        # GitHub at once, before the domain records point at GitHub, so nobody else can claim the name in between.
        $fwd = Join-Path $src 'tools\avnione-in'
        if (Test-Path -LiteralPath (Join-Path $fwd 'index.html')) {
            $fRepo = "$($GhRepo)-in"
            & gh api "repos/$fRepo" 2>$null | Out-Null
            if ($LASTEXITCODE -ne 0) {
                & gh repo create $fRepo --public --description "avnione.in - sends every visitor to the same page on avnione.com" --homepage "https://avnione.in" --disable-wiki --disable-issues 2>&1 | Out-Null
                if ($LASTEXITCODE -ne 0) { throw "the forwarder repository $fRepo could not be made" }
            }
            $tmp = Join-Path $Build 'avnione-in'
            if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
            New-Item -ItemType Directory -Force $tmp | Out-Null
            Copy-Item -Path (Join-Path $fwd '*') -Destination $tmp -Force
            Copy-Item -LiteralPath (Join-Path $fwd '.nojekyll') -Destination $tmp -Force -ErrorAction SilentlyContinue
            & git -C $tmp init -q -b main 2>&1 | Out-Null
            & git -C $tmp add -A 2>&1 | Out-Null
            & git -C $tmp -c user.name=Claude -c user.email=noreply@anthropic.com commit -q -m "avnione.in forwarder from AVNI One website $($Commit.Substring(0, 7)) ($Rc)" 2>&1 | Out-Null
            GitRetry @('-C', $tmp, 'push', '--force', "https://github.com/$fRepo.git", 'main:refs/heads/main') 4 | Out-Null
            & gh api "repos/$fRepo/pages" 2>$null | Out-Null
            if ($LASTEXITCODE -ne 0) {
                '{"source":{"branch":"main","path":"/"}}' | & gh api -X POST "repos/$fRepo/pages" --input - 2>&1 | Out-Null
            }
            Write-Host "  avnione.in forwarder pushed to $fRepo (CNAME avnione.in)"
        }
        New-Item -ItemType Directory -Force $instDir | Out-Null
        [ordered]@{ target = 'AVNI-ONE-WEB'; chain = 'avni-one-web'; commit = $Commit; mark = (Mark); site = (SiteUrl $siteDir); release = $Rc; installedAt = (Get-Date -Format 'dd-MM-yyyy HH:mm') } |
            ConvertTo-Json | Set-Content -LiteralPath $instF -Encoding UTF8
        Write-Host "installed: main on GitHub = $($Commit.Substring(0, 7)) (build mark $(Mark)); the site rebuilds in a minute or two"
    }
    'verify' {
        Internet 5
        $want = Mark
        $site = SiteUrl $siteDir
        $since = [datetime]::MinValue
        $askedF = Join-Path $Build 'build-asked-at.txt'
        if (Test-Path -LiteralPath $askedF) { $since = [datetime]::Parse((Get-Content -LiteralPath $askedF -Raw).Trim(), [cultureinfo]::InvariantCulture, [System.Globalization.DateTimeStyles]::AdjustToUniversal) }
        . (Join-Path $tools 'release\pages_builds.ps1')
        $built = $false; $v = $null
        for ($i = 0; $i -lt 40; $i++) {
            try {
                $list = & gh api "repos/$GhRepo/pages/builds?per_page=30" 2>$null | ConvertFrom-Json
                $v = Get-PagesVerdict $list $Commit $since
                Write-Host "  Pages builds of $($Commit.Substring(0, 7)): $($v.verdict) - $($v.note)"
                if ($v.verdict -eq 'built') { $built = $true; break }
            } catch { Write-Host "  Pages builds could not be read: $_" }
            Start-Sleep -Seconds 10
        }
        if (-not $built -and $v -and $v.verdict -eq 'errored') { throw "GitHub Pages build of $($Commit.Substring(0, 7)) errored: $($v.note)" }
        if (-not $built) { Write-Host "  note: GitHub did not report a finished build in time; the site itself decides below" }
        # the site's own copy is cached up to 10 minutes; the wait here is 14 minutes
        $ok = $false; $seen = ''
        for ($i = 0; $i -lt 84; $i++) {
            try { $seen = (Fetch "$site/build.txt" 2).Trim() } catch { $seen = "no answer" }
            if ($seen -eq $want) {
                $page = Fetch "$site/" 3
                if ($page -match 'AVNI <span class="one">ONE</span>') { $ok = $true; break }
            }
            Start-Sleep -Seconds 10
        }
        if (-not $ok) { throw "the site does not serve build mark $want yet (it shows '$seen') after 14 minutes - not verified" }
        $live = LiveCommit
        if ($live -ne $Commit) { throw "GitHub main is $($live.Substring(0, 7)), not the candidate $($Commit.Substring(0, 7))" }
        Write-Host "verified: $site serves build mark $want from commit $($Commit.Substring(0, 7)) (build.txt and the home page, no cache)"
    }
    'rollback' {
        if (-not (Test-Path -LiteralPath $before)) { throw "no rollback point at $before" }
        $prev = (Get-Content -LiteralPath $before -Raw | ConvertFrom-Json).liveCommit
        Internet 20
        if ($prev) {
            GitRetry @('-C', $src, 'push', '--force', $Remote, "${prev}:refs/heads/main") 6 | Out-Null
            try { & gh api -X POST "repos/$GhRepo/pages/builds" 2>$null | Out-Null } catch {}
            $msg = "main on GitHub = $($prev.Substring(0, 7)) (what the site served before $Rc)"
        } else {
            try { & gh api -X DELETE "repos/$GhRepo/pages" 2>$null | Out-Null } catch {}
            $prev = ''
            $msg = "the site is switched off again (nothing was served before $Rc)"
        }
        New-Item -ItemType Directory -Force $instDir | Out-Null
        [ordered]@{ target = 'AVNI-ONE-WEB'; chain = 'avni-one-web'; commit = $prev; release = "$Rc rolled back"; installedAt = (Get-Date -Format 'dd-MM-yyyy HH:mm') } |
            ConvertTo-Json | Set-Content -LiteralPath $instF -Encoding UTF8
        Write-Host "rolled back: $msg"
    }
}

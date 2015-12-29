



<!DOCTYPE html>
<html lang="en" class=" is-copy-enabled is-u2f-enabled">
  <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# object: http://ogp.me/ns/object# article: http://ogp.me/ns/article# profile: http://ogp.me/ns/profile#">
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Content-Language" content="en">
    <meta name="viewport" content="width=1020">
    
    
    <title>disconf/README.md at master · knightliao/disconf</title>
    <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="GitHub">
    <link rel="fluid-icon" href="https://github.com/fluidicon.png" title="GitHub">
    <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-114.png">
    <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-144.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144.png">
    <meta property="fb:app_id" content="1401488693436528">

      <meta content="@github" name="twitter:site" /><meta content="summary" name="twitter:card" /><meta content="knightliao/disconf" name="twitter:title" /><meta content="disconf - Distributed Configuration Management Platform(分布式配置管理平台)" name="twitter:description" /><meta content="https://avatars2.githubusercontent.com/u/3657476?v=3&amp;s=400" name="twitter:image:src" />
      <meta content="GitHub" property="og:site_name" /><meta content="object" property="og:type" /><meta content="https://avatars2.githubusercontent.com/u/3657476?v=3&amp;s=400" property="og:image" /><meta content="knightliao/disconf" property="og:title" /><meta content="https://github.com/knightliao/disconf" property="og:url" /><meta content="disconf - Distributed Configuration Management Platform(分布式配置管理平台)" property="og:description" />
      <meta name="browser-stats-url" content="https://api.github.com/_private/browser/stats">
    <meta name="browser-errors-url" content="https://api.github.com/_private/browser/errors">
    <link rel="assets" href="https://assets-cdn.github.com/">
    <link rel="web-socket" href="wss://live.github.com/_sockets/MTY4OTIwNjpiYjQxNjc2MDI1ZDNjMDQ5YzY3YzkwYzAwNGY5MDk4OTplYzg3YzJjNDQzNmFlMTM0YzhkYjg3YzcyYWU5NGYxZGNkNzQ2NmZmNTFmZmU1OWU1NTYyNDMzYjNlM2IwNjE1--67124b26844b372ee197047cbdf66cfc0edeb534">
    <meta name="pjax-timeout" content="1000">
    <link rel="sudo-modal" href="/sessions/sudo_modal">

    <meta name="msapplication-TileImage" content="/windows-tile.png">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="selected-link" value="repo_source" data-pjax-transient>

    <meta name="google-site-verification" content="KT5gs8h0wvaagLKAVWq8bbeNwnZZK1r1XQysX3xurLU">
    <meta name="google-analytics" content="UA-3769691-2">

<meta content="collector.githubapp.com" name="octolytics-host" /><meta content="github" name="octolytics-app-id" /><meta content="74CC5CF5:6925:343B200E:5680FCEF" name="octolytics-dimension-request_id" /><meta content="1689206" name="octolytics-actor-id" /><meta content="is00hcw" name="octolytics-actor-login" /><meta content="1de2da4714ae3bb84c7827dea71300f0889ac7668cd5be409e9b6af6f209c75d" name="octolytics-actor-hash" />
<meta content="/&lt;user-name&gt;/&lt;repo-name&gt;/blob/show" data-pjax-transient="true" name="analytics-location" />
<meta content="Rails, view, blob#show" data-pjax-transient="true" name="analytics-event" />


  <meta class="js-ga-set" name="dimension1" content="Logged In">



        <meta name="hostname" content="github.com">
    <meta name="user-login" content="is00hcw">

        <meta name="expected-hostname" content="github.com">

      <link rel="mask-icon" href="https://assets-cdn.github.com/pinned-octocat.svg" color="#4078c0">
      <link rel="icon" type="image/x-icon" href="https://assets-cdn.github.com/favicon.ico">

    <meta content="bef2630c884eb694297b9fbcb6eab4ed439ed97f" name="form-nonce" />

    <link crossorigin="anonymous" href="https://assets-cdn.github.com/assets/github-16bf5399d85a6f926eb6af8f983ed5cf907e97b4da4a650dc11920d425826218.css" integrity="sha256-Fr9Tmdhab5Jutq+PmD7Vz5B+l7TaSmUNwRkg1CWCYhg=" media="all" rel="stylesheet" />
    <link crossorigin="anonymous" href="https://assets-cdn.github.com/assets/github2-451ab63ad67fa9af580e5d9a3b2b7de911ce2e4b2437638f26fe8cb3879e67d8.css" integrity="sha256-RRq2OtZ/qa9YDl2aOyt96RHOLkskN2OPJv6Ms4eeZ9g=" media="all" rel="stylesheet" />
    
    


    <meta http-equiv="x-pjax-version" content="be269b1951a3572820c1f935e13a2f75">

      
  <meta name="description" content="disconf - Distributed Configuration Management Platform(分布式配置管理平台)">
  <meta name="go-import" content="github.com/knightliao/disconf git https://github.com/knightliao/disconf.git">

  <meta content="3657476" name="octolytics-dimension-user_id" /><meta content="knightliao" name="octolytics-dimension-user_login" /><meta content="20324739" name="octolytics-dimension-repository_id" /><meta content="knightliao/disconf" name="octolytics-dimension-repository_nwo" /><meta content="true" name="octolytics-dimension-repository_public" /><meta content="false" name="octolytics-dimension-repository_is_fork" /><meta content="20324739" name="octolytics-dimension-repository_network_root_id" /><meta content="knightliao/disconf" name="octolytics-dimension-repository_network_root_nwo" />
  <link href="https://github.com/knightliao/disconf/commits/master.atom" rel="alternate" title="Recent Commits to disconf:master" type="application/atom+xml">

  </head>


  <body class="logged_in   env-production windows vis-public page-blob">
    <a href="#start-of-content" tabindex="1" class="accessibility-aid js-skip-to-content">Skip to content</a>

    
    
    



      <div class="header header-logged-in true" role="banner">
  <div class="container clearfix">

    <a class="header-logo-invertocat" href="https://github.com/" data-hotkey="g d" aria-label="Homepage" data-ga-click="Header, go to dashboard, icon:logo">
  <span class="mega-octicon octicon-mark-github "></span>
</a>


      <div class="site-search repo-scope js-site-search" role="search">
          <!-- </textarea> --><!-- '"` --><form accept-charset="UTF-8" action="/knightliao/disconf/search" class="js-site-search-form" data-global-search-url="/search" data-repo-search-url="/knightliao/disconf/search" method="get"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /></div>
  <label class="js-chromeless-input-container form-control">
    <div class="scope-badge">This repository</div>
    <input type="text"
      class="js-site-search-focus js-site-search-field is-clearable chromeless-input"
      data-hotkey="s"
      name="q"
      placeholder="Search"
      aria-label="Search this repository"
      data-global-scope-placeholder="Search GitHub"
      data-repo-scope-placeholder="Search"
      tabindex="1"
      autocapitalize="off">
  </label>
</form>
      </div>

      <ul class="header-nav left" role="navigation">
        <li class="header-nav-item">
          <a href="/pulls" class="js-selected-navigation-item header-nav-link" data-ga-click="Header, click, Nav menu - item:pulls context:user" data-hotkey="g p" data-selected-links="/pulls /pulls/assigned /pulls/mentioned /pulls">
            Pull requests
</a>        </li>
        <li class="header-nav-item">
          <a href="/issues" class="js-selected-navigation-item header-nav-link" data-ga-click="Header, click, Nav menu - item:issues context:user" data-hotkey="g i" data-selected-links="/issues /issues/assigned /issues/mentioned /issues">
            Issues
</a>        </li>
          <li class="header-nav-item">
            <a class="header-nav-link" href="https://gist.github.com/" data-ga-click="Header, go to gist, text:gist">Gist</a>
          </li>
      </ul>

    
<ul class="header-nav user-nav right" id="user-links">
  <li class="header-nav-item">
      <span class="js-socket-channel js-updatable-content"
        data-channel="notification-changed:is00hcw"
        data-url="/notifications/header">
      <a href="/notifications" aria-label="You have no unread notifications" class="header-nav-link notification-indicator tooltipped tooltipped-s" data-ga-click="Header, go to notifications, icon:read" data-hotkey="g n">
          <span class="mail-status all-read"></span>
          <span class="octicon octicon-bell "></span>
</a>  </span>

  </li>

  <li class="header-nav-item dropdown js-menu-container">
    <a class="header-nav-link tooltipped tooltipped-s js-menu-target" href="/new"
       aria-label="Create new…"
       data-ga-click="Header, create new, icon:add">
      <span class="octicon octicon-plus left"></span>
      <span class="dropdown-caret"></span>
    </a>

    <div class="dropdown-menu-content js-menu-content">
      <ul class="dropdown-menu dropdown-menu-sw">
        
<a class="dropdown-item" href="/new" data-ga-click="Header, create new repository">
  New repository
</a>


  <a class="dropdown-item" href="/organizations/new" data-ga-click="Header, create new organization">
    New organization
  </a>



  <div class="dropdown-divider"></div>
  <div class="dropdown-header">
    <span title="knightliao/disconf">This repository</span>
  </div>
    <a class="dropdown-item" href="/knightliao/disconf/issues/new" data-ga-click="Header, create new issue">
      New issue
    </a>

      </ul>
    </div>
  </li>

  <li class="header-nav-item dropdown js-menu-container">
    <a class="header-nav-link name tooltipped tooltipped-sw js-menu-target" href="/is00hcw"
       aria-label="View profile and more"
       data-ga-click="Header, show menu, icon:avatar">
      <img alt="@is00hcw" class="avatar" height="20" src="https://avatars2.githubusercontent.com/u/1689206?v=3&amp;s=40" width="20" />
      <span class="dropdown-caret"></span>
    </a>

    <div class="dropdown-menu-content js-menu-content">
      <div class="dropdown-menu  dropdown-menu-sw">
        <div class=" dropdown-header header-nav-current-user css-truncate">
            Signed in as <strong class="css-truncate-target">is00hcw</strong>

        </div>


        <div class="dropdown-divider"></div>

          <a class="dropdown-item" href="/is00hcw" data-ga-click="Header, go to profile, text:your profile">
            Your profile
          </a>
        <a class="dropdown-item" href="/stars" data-ga-click="Header, go to starred repos, text:your stars">
          Your stars
        </a>
        <a class="dropdown-item" href="/explore" data-ga-click="Header, go to explore, text:explore">
          Explore
        </a>
          <a class="dropdown-item" href="/integrations" data-ga-click="Header, go to integrations, text:integrations">
            Integrations
          </a>
        <a class="dropdown-item" href="https://help.github.com" data-ga-click="Header, go to help, text:help">
          Help
        </a>

          <div class="dropdown-divider"></div>

          <a class="dropdown-item" href="/settings/profile" data-ga-click="Header, go to settings, icon:settings">
            Settings
          </a>

          <!-- </textarea> --><!-- '"` --><form accept-charset="UTF-8" action="/logout" class="logout-form" data-form-nonce="bef2630c884eb694297b9fbcb6eab4ed439ed97f" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="fS2sOmksUQFTmZqjOfA1nzygHyLhNnwHaaz/gvDdCGIMQ8/I/43xFrXQcQaeGIpGqs1daXksKNcQ6p8Clvk8aw==" /></div>
            <button class="dropdown-item dropdown-signout" data-ga-click="Header, sign out, icon:logout">
              Sign out
            </button>
</form>
      </div>
    </div>
  </li>
</ul>


    
  </div>
</div>

      

      


    <div id="start-of-content" class="accessibility-aid"></div>

      <div id="js-flash-container">
</div>


    <div role="main" class="main-content">
        <div itemscope itemtype="http://schema.org/WebPage">
    <div id="js-repo-pjax-container" class="context-loader-container js-repo-nav-next" data-pjax-container>
      
<div class="pagehead repohead instapaper_ignore readability-menu experiment-repo-nav">
  <div class="container repohead-details-container">

    

<ul class="pagehead-actions">

  <li>
        <!-- </textarea> --><!-- '"` --><form accept-charset="UTF-8" action="/notifications/subscribe" class="js-social-container" data-autosubmit="true" data-form-nonce="bef2630c884eb694297b9fbcb6eab4ed439ed97f" data-remote="true" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="IBDTYMjcgpy/N1YcVWc/9+7zx9TKELx8e9wwwCzUrG9loDxYpQ/BPwIYepoVWCkehBBaOsjaoFUFM8EZuYTLaQ==" /></div>      <input id="repository_id" name="repository_id" type="hidden" value="20324739" />

        <div class="select-menu js-menu-container js-select-menu">
          <a href="/knightliao/disconf/subscription"
            class="btn btn-sm btn-with-count select-menu-button js-menu-target" role="button" tabindex="0" aria-haspopup="true"
            data-ga-click="Repository, click Watch settings, action:blob#show">
            <span class="js-select-button">
              <span class="octicon octicon-eye "></span>
              Watch
            </span>
          </a>
          <a class="social-count js-social-count" href="/knightliao/disconf/watchers">
            145
          </a>

        <div class="select-menu-modal-holder">
          <div class="select-menu-modal subscription-menu-modal js-menu-content" aria-hidden="true">
            <div class="select-menu-header">
              <span aria-label="Close" class="octicon octicon-x js-menu-close" role="button"></span>
              <span class="select-menu-title">Notifications</span>
            </div>

              <div class="select-menu-list js-navigation-container" role="menu">

                <div class="select-menu-item js-navigation-item selected" role="menuitem" tabindex="0">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <div class="select-menu-item-text">
                    <input checked="checked" id="do_included" name="do" type="radio" value="included" />
                    <span class="select-menu-item-heading">Not watching</span>
                    <span class="description">Be notified when participating or @mentioned.</span>
                    <span class="js-select-button-text hidden-select-button-text">
                      <span class="octicon octicon-eye"></span>
                      Watch
                    </span>
                  </div>
                </div>

                <div class="select-menu-item js-navigation-item " role="menuitem" tabindex="0">
                  <span class="select-menu-item-icon octicon octicon octicon-check"></span>
                  <div class="select-menu-item-text">
                    <input id="do_subscribed" name="do" type="radio" value="subscribed" />
                    <span class="select-menu-item-heading">Watching</span>
                    <span class="description">Be notified of all conversations.</span>
                    <span class="js-select-button-text hidden-select-button-text">
                      <span class="octicon octicon-eye"></span>
                      Unwatch
                    </span>
                  </div>
                </div>

                <div class="select-menu-item js-navigation-item " role="menuitem" tabindex="0">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <div class="select-menu-item-text">
                    <input id="do_ignore" name="do" type="radio" value="ignore" />
                    <span class="select-menu-item-heading">Ignoring</span>
                    <span class="description">Never be notified.</span>
                    <span class="js-select-button-text hidden-select-button-text">
                      <span class="octicon octicon-mute"></span>
                      Stop ignoring
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
</form>
  </li>

  <li>
    
  <div class="js-toggler-container js-social-container starring-container ">

    <!-- </textarea> --><!-- '"` --><form accept-charset="UTF-8" action="/knightliao/disconf/unstar" class="js-toggler-form starred js-unstar-button" data-form-nonce="bef2630c884eb694297b9fbcb6eab4ed439ed97f" data-remote="true" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="nEdWEnER1oroBBdrSfnoPxyvduma95nuv6OEeh88DZ8IEGmUBD/pDEFxbPVgg2tei3gmCgCVnYJJOFxGnddyGw==" /></div>
      <button
        class="btn btn-sm btn-with-count js-toggler-target"
        aria-label="Unstar this repository" title="Unstar knightliao/disconf"
        data-ga-click="Repository, click unstar button, action:blob#show; text:Unstar">
        <span class="octicon octicon-star "></span>
        Unstar
      </button>
        <a class="social-count js-social-count" href="/knightliao/disconf/stargazers">
          549
        </a>
</form>
    <!-- </textarea> --><!-- '"` --><form accept-charset="UTF-8" action="/knightliao/disconf/star" class="js-toggler-form unstarred js-star-button" data-form-nonce="bef2630c884eb694297b9fbcb6eab4ed439ed97f" data-remote="true" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="vAkuPDDKuGQATlC3HMElPCcebQlJvT2CYCAYBgdBiruZfEhDKZw57OtOrBdA/hAtPBSWuVE/rWzXyH9F1JtfHA==" /></div>
      <button
        class="btn btn-sm btn-with-count js-toggler-target"
        aria-label="Star this repository" title="Star knightliao/disconf"
        data-ga-click="Repository, click star button, action:blob#show; text:Star">
        <span class="octicon octicon-star "></span>
        Star
      </button>
        <a class="social-count js-social-count" href="/knightliao/disconf/stargazers">
          549
        </a>
</form>  </div>

  </li>

  <li>
          <!-- </textarea> --><!-- '"` --><form accept-charset="UTF-8" action="/knightliao/disconf/fork" class="btn-with-count" data-form-nonce="bef2630c884eb694297b9fbcb6eab4ed439ed97f" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="MyUmaZQ7qj9xLaa2+G61Gb9WvyHo/yESufNxHEAL/XimUTjaRPyU9V0QxXyj29QTgjlfeL8zdry8itbHHG+irg==" /></div>
            <button
                type="submit"
                class="btn btn-sm btn-with-count"
                data-ga-click="Repository, show fork modal, action:blob#show; text:Fork"
                title="Fork your own copy of knightliao/disconf to your account"
                aria-label="Fork your own copy of knightliao/disconf to your account">
              <span class="octicon octicon-repo-forked "></span>
              Fork
            </button>
</form>
    <a href="/knightliao/disconf/network" class="social-count">
      283
    </a>
  </li>
</ul>

    <h1 itemscope itemtype="http://data-vocabulary.org/Breadcrumb" class="entry-title public ">
  <span class="octicon octicon-repo "></span>
  <span class="author"><a href="/knightliao" class="url fn" itemprop="url" rel="author"><span itemprop="title">knightliao</span></a></span><!--
--><span class="path-divider">/</span><!--
--><strong><a href="/knightliao/disconf" data-pjax="#js-repo-pjax-container">disconf</a></strong>

  <span class="page-context-loader">
    <img alt="" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
  </span>

</h1>

  </div>
  <div class="container">
    
<nav class="reponav js-repo-nav js-sidenav-container-pjax js-octicon-loaders"
     role="navigation"
     data-pjax="#js-repo-pjax-container">

  <a href="/knightliao/disconf" aria-label="Code" aria-selected="true" class="js-selected-navigation-item selected reponav-item" data-hotkey="g c" data-selected-links="repo_source repo_downloads repo_commits repo_releases repo_tags repo_branches /knightliao/disconf">
    <span class="octicon octicon-code "></span>
    Code
</a>
    <a href="/knightliao/disconf/issues" class="js-selected-navigation-item reponav-item" data-hotkey="g i" data-selected-links="repo_issues repo_labels repo_milestones /knightliao/disconf/issues">
      <span class="octicon octicon-issue-opened "></span>
      Issues
      <span class="counter">9</span>
</a>
  <a href="/knightliao/disconf/pulls" class="js-selected-navigation-item reponav-item" data-hotkey="g p" data-selected-links="repo_pulls /knightliao/disconf/pulls">
    <span class="octicon octicon-git-pull-request "></span>
    Pull requests
    <span class="counter">1</span>
</a>
    <a href="/knightliao/disconf/wiki" class="js-selected-navigation-item reponav-item" data-hotkey="g w" data-selected-links="repo_wiki /knightliao/disconf/wiki">
      <span class="octicon octicon-book "></span>
      Wiki
</a>
  <a href="/knightliao/disconf/pulse" class="js-selected-navigation-item reponav-item" data-selected-links="pulse /knightliao/disconf/pulse">
    <span class="octicon octicon-pulse "></span>
    Pulse
</a>
  <a href="/knightliao/disconf/graphs" class="js-selected-navigation-item reponav-item" data-selected-links="repo_graphs repo_contributors /knightliao/disconf/graphs">
    <span class="octicon octicon-graph "></span>
    Graphs
</a>

</nav>

  </div>
</div>

<div class="container new-discussion-timeline experiment-repo-nav">
  <div class="repository-content">

    

<a href="/knightliao/disconf/blob/7c803830a7685e0b49d61be99ec22e92fe700f45/disconf-web/README.md" class="hidden js-permalink-shortcut" data-hotkey="y">Permalink</a>

<!-- blob contrib key: blob_contributors:v21:359378db71b2a00c7af9293da402bb4e -->

<div class="file-navigation js-zeroclipboard-container">
  
<div class="select-menu js-menu-container js-select-menu left">
  <button class="btn btn-sm select-menu-button js-menu-target css-truncate" data-hotkey="w"
    title="master"
    type="button" aria-label="Switch branches or tags" tabindex="0" aria-haspopup="true">
    <i>Branch:</i>
    <span class="js-select-button css-truncate-target">master</span>
  </button>

  <div class="select-menu-modal-holder js-menu-content js-navigation-container" data-pjax aria-hidden="true">

    <div class="select-menu-modal">
      <div class="select-menu-header">
        <span aria-label="Close" class="octicon octicon-x js-menu-close" role="button"></span>
        <span class="select-menu-title">Switch branches/tags</span>
      </div>

      <div class="select-menu-filters">
        <div class="select-menu-text-filter">
          <input type="text" aria-label="Filter branches/tags" id="context-commitish-filter-field" class="js-filterable-field js-navigation-enable" placeholder="Filter branches/tags">
        </div>
        <div class="select-menu-tabs">
          <ul>
            <li class="select-menu-tab">
              <a href="#" data-tab-filter="branches" data-filter-placeholder="Filter branches/tags" class="js-select-menu-tab" role="tab">Branches</a>
            </li>
            <li class="select-menu-tab">
              <a href="#" data-tab-filter="tags" data-filter-placeholder="Find a tag…" class="js-select-menu-tab" role="tab">Tags</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket" data-tab-filter="branches" role="menu">

        <div data-filterable-for="context-commitish-filter-field" data-filterable-type="substring">


            <a class="select-menu-item js-navigation-item js-navigation-open "
               href="/knightliao/disconf/blob/dev/disconf-web/README.md"
               data-name="dev"
               data-skip-pjax="true"
               rel="nofollow">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <span class="select-menu-item-text css-truncate-target" title="dev">
                dev
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open selected"
               href="/knightliao/disconf/blob/master/disconf-web/README.md"
               data-name="master"
               data-skip-pjax="true"
               rel="nofollow">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <span class="select-menu-item-text css-truncate-target" title="master">
                master
              </span>
            </a>
        </div>

          <div class="select-menu-no-results">Nothing to show</div>
      </div>

      <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket" data-tab-filter="tags">
        <div data-filterable-for="context-commitish-filter-field" data-filterable-type="substring">


            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/knightliao/disconf/tree/disconf-core/disconf-web/README.md"
                 data-name="disconf-core"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="disconf-core">disconf-core</a>
            </div>
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/knightliao/disconf/tree/disconf-core-new/disconf-web/README.md"
                 data-name="disconf-core-new"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="disconf-core-new">disconf-core-new</a>
            </div>
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/knightliao/disconf/tree/disconf-core-2.3-0/disconf-web/README.md"
                 data-name="disconf-core-2.3-0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="disconf-core-2.3-0">disconf-core-2.3-0</a>
            </div>
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/knightliao/disconf/tree/disconf-core-2.1/disconf-web/README.md"
                 data-name="disconf-core-2.1"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="disconf-core-2.1">disconf-core-2.1</a>
            </div>
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/knightliao/disconf/tree/disconf-core-2.1-3/disconf-web/README.md"
                 data-name="disconf-core-2.1-3"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="disconf-core-2.1-3">disconf-core-2.1-3</a>
            </div>
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/knightliao/disconf/tree/disconf-core-2.1-1/disconf-web/README.md"
                 data-name="disconf-core-2.1-1"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="disconf-core-2.1-1">disconf-core-2.1-1</a>
            </div>
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/knightliao/disconf/tree/disconf-core-2.1-0/disconf-web/README.md"
                 data-name="disconf-core-2.1-0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="disconf-core-2.1-0">disconf-core-2.1-0</a>
            </div>
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/knightliao/disconf/tree/disconf-base-2.1/disconf-web/README.md"
                 data-name="disconf-base-2.1"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="disconf-base-2.1">disconf-base-2.1</a>
            </div>
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/knightliao/disconf/tree/disconf-base-2.0.0/disconf-web/README.md"
                 data-name="disconf-base-2.0.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="disconf-base-2.0.0">disconf-base-2.0.0</a>
            </div>
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/knightliao/disconf/tree/disconf-2.6.25/disconf-web/README.md"
                 data-name="disconf-2.6.25"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="disconf-2.6.25">disconf-2.6.25</a>
            </div>
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/knightliao/disconf/tree/2.6.30/disconf-web/README.md"
                 data-name="2.6.30"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="2.6.30">2.6.30</a>
            </div>
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/knightliao/disconf/tree/2.6.29/disconf-web/README.md"
                 data-name="2.6.29"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="2.6.29">2.6.29</a>
            </div>
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/knightliao/disconf/tree/2.6.28/disconf-web/README.md"
                 data-name="2.6.28"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="2.6.28">2.6.28</a>
            </div>
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/knightliao/disconf/tree/2.6.27/disconf-web/README.md"
                 data-name="2.6.27"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="2.6.27">2.6.27</a>
            </div>
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/knightliao/disconf/tree/2.6.2/disconf-web/README.md"
                 data-name="2.6.2"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="2.6.2">2.6.2</a>
            </div>
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/knightliao/disconf/tree/2.0.0/disconf-web/README.md"
                 data-name="2.0.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="2.0.0">2.0.0</a>
            </div>
        </div>

        <div class="select-menu-no-results">Nothing to show</div>
      </div>

    </div>
  </div>
</div>

  <div class="btn-group right">
    <a href="/knightliao/disconf/find/master"
          class="js-show-file-finder btn btn-sm"
          data-pjax
          data-hotkey="t">
      Find file
    </a>
    <button aria-label="Copy file path to clipboard" class="js-zeroclipboard btn btn-sm zeroclipboard-button tooltipped tooltipped-s" data-copied-hint="Copied!" type="button">Copy path</button>
  </div>
  <div class="breadcrumb js-zeroclipboard-target">
    <span class="repo-root js-repo-root"><span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/knightliao/disconf" class="" data-branch="master" data-pjax="true" itemscope="url"><span itemprop="title">disconf</span></a></span></span><span class="separator">/</span><span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/knightliao/disconf/tree/master/disconf-web" class="" data-branch="master" data-pjax="true" itemscope="url"><span itemprop="title">disconf-web</span></a></span><span class="separator">/</span><strong class="final-path">README.md</strong>
  </div>
</div>


  <div class="commit-tease">
      <span class="right">
        <a class="commit-tease-sha" href="/knightliao/disconf/commit/62abfaf5d59d0a1ec8066d1d818310a14af88801" data-pjax>
          62abfaf
        </a>
        <time datetime="2015-10-21T07:04:55Z" is="relative-time">Oct 21, 2015</time>
      </span>
      <div>
        <img alt="@knightliao" class="avatar" height="20" src="https://avatars1.githubusercontent.com/u/3657476?v=3&amp;s=40" width="20" />
        <a href="/knightliao" class="user-mention" rel="author">knightliao</a>
          <a href="/knightliao/disconf/commit/62abfaf5d59d0a1ec8066d1d818310a14af88801" class="message" data-pjax="true" title="修复新建配置时下拉列表的bug">修复新建配置时下拉列表的bug</a>
      </div>

    <div class="commit-tease-contributors">
      <a class="muted-link contributors-toggle" href="#blob_contributors_box" rel="facebox">
        <strong>2</strong>
         contributors
      </a>
          <a class="avatar-link tooltipped tooltipped-s" aria-label="knightliao" href="/knightliao/disconf/commits/master/disconf-web/README.md?author=knightliao"><img alt="@knightliao" class="avatar" height="20" src="https://avatars1.githubusercontent.com/u/3657476?v=3&amp;s=40" width="20" /> </a>
    <a class="avatar-link tooltipped tooltipped-s" aria-label="ngloom" href="/knightliao/disconf/commits/master/disconf-web/README.md?author=ngloom"><img alt="@ngloom" class="avatar" height="20" src="https://avatars1.githubusercontent.com/u/495831?v=3&amp;s=40" width="20" /> </a>


    </div>

    <div id="blob_contributors_box" style="display:none">
      <h2 class="facebox-header" data-facebox-id="facebox-header">Users who have contributed to this file</h2>
      <ul class="facebox-user-list" data-facebox-id="facebox-description">
          <li class="facebox-user-list-item">
            <img alt="@knightliao" height="24" src="https://avatars3.githubusercontent.com/u/3657476?v=3&amp;s=48" width="24" />
            <a href="/knightliao">knightliao</a>
          </li>
          <li class="facebox-user-list-item">
            <img alt="@ngloom" height="24" src="https://avatars3.githubusercontent.com/u/495831?v=3&amp;s=48" width="24" />
            <a href="/ngloom">ngloom</a>
          </li>
      </ul>
    </div>
  </div>

<div class="file">
  <div class="file-header">
  <div class="file-actions">

    <div class="btn-group">
      <a href="/knightliao/disconf/raw/master/disconf-web/README.md" class="btn btn-sm " id="raw-url">Raw</a>
        <a href="/knightliao/disconf/blame/master/disconf-web/README.md" class="btn btn-sm js-update-url-with-hash">Blame</a>
      <a href="/knightliao/disconf/commits/master/disconf-web/README.md" class="btn btn-sm " rel="nofollow">History</a>
    </div>

        <a class="octicon-btn tooltipped tooltipped-nw"
           href="github-windows://openRepo/https://github.com/knightliao/disconf?branch=master&amp;filepath=disconf-web%2FREADME.md"
           aria-label="Open this file in GitHub Desktop"
           data-ga-click="Repository, open with desktop, type:windows">
            <span class="octicon octicon-device-desktop "></span>
        </a>

        <!-- </textarea> --><!-- '"` --><form accept-charset="UTF-8" action="/knightliao/disconf/edit/master/disconf-web/README.md" class="inline-form js-update-url-with-hash" data-form-nonce="bef2630c884eb694297b9fbcb6eab4ed439ed97f" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="IJLMsBoHVtPn+1UxIVfdXPs4cBy6Zonnl3dzD6k7/Hx5PwIAxyYGZ7/numZ8UUlp8F0wa0UCdebFGJrfqtujWw==" /></div>
          <button class="octicon-btn tooltipped tooltipped-nw" type="submit"
            aria-label="Edit the file in your fork of this project" data-hotkey="e" data-disable-with>
            <span class="octicon octicon-pencil "></span>
          </button>
</form>        <!-- </textarea> --><!-- '"` --><form accept-charset="UTF-8" action="/knightliao/disconf/delete/master/disconf-web/README.md" class="inline-form" data-form-nonce="bef2630c884eb694297b9fbcb6eab4ed439ed97f" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="0LoPqyIlXoR59gAYqQjsDnCkv3RJee5oz32UiRYHXwNHwul0H56toHsb0aWB7iYtkfWlav8xKWGE46QwRFaYfg==" /></div>
          <button class="octicon-btn octicon-btn-danger tooltipped tooltipped-nw" type="submit"
            aria-label="Delete the file in your fork of this project" data-disable-with>
            <span class="octicon octicon-trashcan "></span>
          </button>
</form>  </div>

  <div class="file-info">
      189 lines (126 sloc)
      <span class="file-info-divider"></span>
    4.7 KB
  </div>
</div>

  
  <div id="readme" class="blob instapaper_body">
    <article class="markdown-body entry-content" itemprop="mainContentOfPage"><h1><a id="user-content-disconf-web" class="anchor" href="#disconf-web" aria-hidden="true"><span class="octicon octicon-link"></span></a>disconf-web</h1>

<p>分布式配置Web平台服务 模块</p>

<p>推荐使用最新的Chrome或Firefox浏览.</p>

<p>注：由于迭代开发快速多变的原因，当前UI可能与下图略有改变。</p>

<h2><a id="user-content-运行样式" class="anchor" href="#运行样式" aria-hidden="true"><span class="octicon octicon-link"></span></a>运行样式</h2>

<h3><a id="user-content-主页" class="anchor" href="#主页" aria-hidden="true"><span class="octicon octicon-link"></span></a>主页</h3>

<p><a href="https://camo.githubusercontent.com/f9b468d81b09b40b57a4b97bc324be78d8543375/687474703a2f2f7777312e73696e61696d672e636e2f6d77313032342f3630633936323066677731656b64666977313830726a323076743067617766722e6a7067" target="_blank"><img src="https://camo.githubusercontent.com/f9b468d81b09b40b57a4b97bc324be78d8543375/687474703a2f2f7777312e73696e61696d672e636e2f6d77313032342f3630633936323066677731656b64666977313830726a323076743067617766722e6a7067" alt="" data-canonical-src="http://ww1.sinaimg.cn/mw1024/60c9620fgw1ekdfiw180rj20vt0gawfr.jpg" style="max-width:100%;"></a></p>

<h3><a id="user-content-登录页" class="anchor" href="#登录页" aria-hidden="true"><span class="octicon octicon-link"></span></a>登录页</h3>

<p>可以使用 admin   admin 进行登录。</p>

<p><a href="https://camo.githubusercontent.com/079132a38890585a1f4b17c929e9fb471a68d5a0/687474703a2f2f7777342e73696e61696d672e636e2f6d77313032342f3630633936323066677731656b64666a6b676264636a323074373069653735372e6a7067" target="_blank"><img src="https://camo.githubusercontent.com/079132a38890585a1f4b17c929e9fb471a68d5a0/687474703a2f2f7777342e73696e61696d672e636e2f6d77313032342f3630633936323066677731656b64666a6b676264636a323074373069653735372e6a7067" alt="" data-canonical-src="http://ww4.sinaimg.cn/mw1024/60c9620fgw1ekdfjkgbdcj20t70ie757.jpg" style="max-width:100%;"></a></p>

<h3><a id="user-content-主界面" class="anchor" href="#主界面" aria-hidden="true"><span class="octicon octicon-link"></span></a>主界面</h3>

<p><a href="https://camo.githubusercontent.com/bbd4f7939394ea91b4fe6a0a3f9fe665309fca97/687474703a2f2f7777332e73696e61696d672e636e2f6d77313032342f3630633936323066677731656d7876316e773075346a3230717030686f6d79302e6a7067" target="_blank"><img src="https://camo.githubusercontent.com/bbd4f7939394ea91b4fe6a0a3f9fe665309fca97/687474703a2f2f7777332e73696e61696d672e636e2f6d77313032342f3630633936323066677731656d7876316e773075346a3230717030686f6d79302e6a7067" alt="http://ww3.sinaimg.cn/mw1024/60c9620fgw1emxv1nw0u4j20qp0homy0.jpg" data-canonical-src="http://ww3.sinaimg.cn/mw1024/60c9620fgw1emxv1nw0u4j20qp0homy0.jpg" style="max-width:100%;"></a></p>

<p>左上角可以选择APP和环境，选择之后，就会在中间出现若干个版本，</p>

<p>选择版本后，就会显示 APP、环境、版本 三个条件下的配置列表：</p>

<p><a href="https://camo.githubusercontent.com/ad6f2d09151e6b75bf95f493b704277e73292739/687474703a2f2f7777312e73696e61696d672e636e2f6d77313032342f3630633936323066677731656d7977773339776a6d6a32307177306b6571366d2e6a7067" target="_blank"><img src="https://camo.githubusercontent.com/ad6f2d09151e6b75bf95f493b704277e73292739/687474703a2f2f7777312e73696e61696d672e636e2f6d77313032342f3630633936323066677731656d7977773339776a6d6a32307177306b6571366d2e6a7067" alt="http://ww1.sinaimg.cn/mw1024/60c9620fgw1emyww39wjmj20qw0keq6m.jpg" data-canonical-src="http://ww1.sinaimg.cn/mw1024/60c9620fgw1emyww39wjmj20qw0keq6m.jpg" style="max-width:100%;"></a></p>

<h4><a id="user-content-表格中-各个列的意义是" class="anchor" href="#表格中-各个列的意义是" aria-hidden="true"><span class="octicon octicon-link"></span></a>表格中 各个列的意义是：</h4>

<ul>
<li>APP：使用哪个APP，及它的ID</li>
<li>KEY：配置文件或配置项</li>
<li>配置内容：配置文件或配置项在配置中心中的值</li>
<li>实例列表：使用此配置文件或配置项的所有实例列表，及每个实例的配置值。如果实例的配置值与配置中心的值不一致，这里会标识出来。</li>
<li>修改时间：修改此配置的最后一次时间 </li>
<li>操作：个性、删除、下载</li>
</ul>

<h4><a id="user-content-右上角可以" class="anchor" href="#右上角可以" aria-hidden="true"><span class="octicon octicon-link"></span></a>右上角可以</h4>

<p>新建配置项、新建配置文件、新建APP</p>

<h4><a id="user-content-表格右上方" class="anchor" href="#表格右上方" aria-hidden="true"><span class="octicon octicon-link"></span></a>表格右上方</h4>

<p>可以批量下载所有配置文件至本地，还可以查看ZK上的部署情况。</p>

<h2><a id="user-content-how-to-deploy" class="anchor" href="#how-to-deploy" aria-hidden="true"><span class="octicon octicon-link"></span></a>How to deploy</h2>

<h3><a id="user-content-安装依赖软件" class="anchor" href="#安装依赖软件" aria-hidden="true"><span class="octicon octicon-link"></span></a>安装依赖软件</h3>

<ul>
<li>安装Mysql（Ver 14.12 Distrib 5.0.45, for unknown-linux-gnu (x86_64) using  EditLine wrapper）</li>
<li>安装Tomcat（apache-tomcat-7.0.50）</li>
<li>安装Nginx（nginx/1.5.3）</li>
<li>安装 zookeeeper （zookeeper-3.3.0）</li>
<li>安装 Redis （2.4.5）</li>
</ul>

<h3><a id="user-content-准备配置" class="anchor" href="#准备配置" aria-hidden="true"><span class="octicon octicon-link"></span></a>准备配置</h3>

<p><strong>将你的配置文件放到此地址目录下（以下地址可自行设定）：</strong></p>

<pre><code>home/work/dsp/disconf-rd/online-resources
</code></pre>

<p>配置文件包括：</p>

<pre><code>- jdbc-mysql.properties (数据库配置)
- redis-config.properties (Redis配置)
- zoo.properties (Zookeeper配置)
- application.properties (应用配置）
</code></pre>

<p>注意，记得执行将application-demo.properties复制成application.properties：</p>

<pre><code>cp application-demo.properties application.properties 
</code></pre>

<p><strong>设置War包将要被部署的地址（以下地址可自行设定）：</strong></p>

<pre><code>/home/work/dsp/disconf-rd/war
</code></pre>

<h3><a id="user-content-构建" class="anchor" href="#构建" aria-hidden="true"><span class="octicon octicon-link"></span></a>构建</h3>

<pre><code>ONLINE_CONFIG_PATH=/home/work/dsp/disconf-rd/online-resources
WAR_ROOT_PATH=/home/work/dsp/disconf-rd/war
export ONLINE_CONFIG_PATH
export WAR_ROOT_PATH
cd disconf-web
sh deploy/deploy.sh
</code></pre>

<p>这样会在    /home/work/dsp/disconf-rd/war 生成以下结果：</p>

<pre><code>-disconf-web.war  
-html  
-META-INF  
-WEB-INF
</code></pre>

<h3><a id="user-content-上线前的初始化工作" class="anchor" href="#上线前的初始化工作" aria-hidden="true"><span class="octicon octicon-link"></span></a>上线前的初始化工作</h3>

<p><strong>初始化数据库：</strong></p>

<p>依次执行：</p>

<ul>
<li>执行 sql/1-init_table.sql</li>
<li>执行 sql/2-data.sql</li>
<li>执行 sql/20141201/disconf.sql</li>
</ul>

<p>里面默认有6个用户</p>

<p>如果想自己设置初始化的用户名信息，可以参考代码来自己生成用户：</p>

<pre><code>src/main/java/com/baidu/disconf/web/tools/UserCreateTools.java
</code></pre>

<h3><a id="user-content-部署war" class="anchor" href="#部署war" aria-hidden="true"><span class="octicon octicon-link"></span></a>部署War</h3>

<p>修改server.xml文件，在Host结点下设定Context：</p>

<pre><code>&lt;Context path="" docBase="/home/work/dsp/disconf-rd/war"&gt;&lt;/Context&gt;
</code></pre>

<p>并设置端口为 8015</p>

<p>启动Tomcat，即可。</p>

<h3><a id="user-content-部署-前端" class="anchor" href="#部署-前端" aria-hidden="true"><span class="octicon octicon-link"></span></a>部署 前端</h3>

<p>修改 nginx.conf</p>

<pre><code>upstream disconf {
    server 127.0.0.1:8015;
}

server {

    listen   8081;
    server_name localhost;
    access_log /home/work/var/logs/disconf/access.log;
    error_log /home/work/var/logs/disconf/error.log;

    location / {
        root /home/work/dsp/disconf-rd/war/html;
        if ($query_string) {
            expires max;
        }
    }

    location ~ ^/(api|export) {
        proxy_pass_header Server;
        proxy_set_header Host $http_host;
        proxy_redirect off;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Scheme $scheme;
        proxy_pass http://disconf;
    }
}
</code></pre>

<h2><a id="user-content-业务功能" class="anchor" href="#业务功能" aria-hidden="true"><span class="octicon octicon-link"></span></a>业务功能</h2>

<ul>
<li>支持用户登录/登出</li>
<li>浏览配置

<ul>
<li>按 APP/版本/环境 选择</li>
</ul></li>
<li>修改配置

<ul>
<li>修改配置项</li>
<li>修改配置文件</li>
</ul></li>
<li>新建配置

<ul>
<li>新建配置项</li>
<li>新建配置文件</li>
<li>新建APP</li>
</ul></li>
</ul>

<h2><a id="user-content-架构方案" class="anchor" href="#架构方案" aria-hidden="true"><span class="octicon octicon-link"></span></a>架构方案</h2>

<p>Nginx(处理静态请求) + Tomcat(处理动态请求）</p>

<ul>
<li><strong>后端</strong>

<ul>
<li>SpringMvc（3.1.2+)</li>
<li>Jdbc-Template</li>
<li>Mysql</li>
<li>RestFul API</li>
<li>Redis for user login/logout</li>
<li>H2内存数据库测试方案/Junit/SpringTest</li>
</ul></li>
<li><strong>前端</strong>

<ul>
<li>HTML</li>
<li>Jquery(1.10.4)：JS工具集合</li>
<li>Bootstrap(2.3.2)：界面UI</li>
<li>Node(ejs/fs/eventproxy): 用于前端的HTML的模板化管理</li>
</ul></li>
<li><strong>前后端接口(前后端分离)</strong>

<ul>
<li>完全Ajax接口</li>
<li>JSON</li>
<li>RestFul API</li>
</ul></li>
</ul>
</article>
  </div>

</div>

<a href="#jump-to-line" rel="facebox[.linejump]" data-hotkey="l" style="display:none">Jump to Line</a>
<div id="jump-to-line" style="display:none">
  <!-- </textarea> --><!-- '"` --><form accept-charset="UTF-8" action="" class="js-jump-to-line-form" method="get"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /></div>
    <input class="linejump-input js-jump-to-line-field" type="text" placeholder="Jump to line&hellip;" aria-label="Jump to line" autofocus>
    <button type="submit" class="btn">Go</button>
</form></div>

  </div>
  <div class="modal-backdrop"></div>
</div>

    </div>
  </div>

    </div>

        <div class="container">
  <div class="site-footer" role="contentinfo">
    <ul class="site-footer-links right">
        <li><a href="https://status.github.com/" data-ga-click="Footer, go to status, text:status">Status</a></li>
      <li><a href="https://developer.github.com" data-ga-click="Footer, go to api, text:api">API</a></li>
      <li><a href="https://training.github.com" data-ga-click="Footer, go to training, text:training">Training</a></li>
      <li><a href="https://shop.github.com" data-ga-click="Footer, go to shop, text:shop">Shop</a></li>
        <li><a href="https://github.com/blog" data-ga-click="Footer, go to blog, text:blog">Blog</a></li>
        <li><a href="https://github.com/about" data-ga-click="Footer, go to about, text:about">About</a></li>
        <li><a href="https://github.com/pricing" data-ga-click="Footer, go to pricing, text:pricing">Pricing</a></li>

    </ul>

    <a href="https://github.com" aria-label="Homepage">
      <span class="mega-octicon octicon-mark-github " title="GitHub "></span>
</a>
    <ul class="site-footer-links">
      <li>&copy; 2015 <span title="0.08243s from github-fe123-cp1-prd.iad.github.net">GitHub</span>, Inc.</li>
        <li><a href="https://github.com/site/terms" data-ga-click="Footer, go to terms, text:terms">Terms</a></li>
        <li><a href="https://github.com/site/privacy" data-ga-click="Footer, go to privacy, text:privacy">Privacy</a></li>
        <li><a href="https://github.com/security" data-ga-click="Footer, go to security, text:security">Security</a></li>
        <li><a href="https://github.com/contact" data-ga-click="Footer, go to contact, text:contact">Contact</a></li>
        <li><a href="https://help.github.com" data-ga-click="Footer, go to help, text:help">Help</a></li>
    </ul>
  </div>
</div>



    
    
    

    <div id="ajax-error-message" class="flash flash-error">
      <span class="octicon octicon-alert"></span>
      <button type="button" class="flash-close js-flash-close js-ajax-error-dismiss" aria-label="Dismiss error">
        <span class="octicon octicon-x"></span>
      </button>
      Something went wrong with that request. Please try again.
    </div>


      <script crossorigin="anonymous" integrity="sha256-7460qJ7p88i3YTMH/liaj1cFgX987ie+xRzl6WMjSr8=" src="https://assets-cdn.github.com/assets/frameworks-ef8eb4a89ee9f3c8b7613307fe589a8f5705817f7cee27bec51ce5e963234abf.js"></script>
      <script async="async" crossorigin="anonymous" integrity="sha256-S2uOfRHrt7zoUSbTtBMMgAQfKubV1u+JAajAw/fLgNI=" src="https://assets-cdn.github.com/assets/github-4b6b8e7d11ebb7bce85126d3b4130c80041f2ae6d5d6ef8901a8c0c3f7cb80d2.js"></script>
      
      
      
    <div class="js-stale-session-flash stale-session-flash flash flash-warn flash-banner hidden">
      <span class="octicon octicon-alert"></span>
      <span class="signed-in-tab-flash">You signed in with another tab or window. <a href="">Reload</a> to refresh your session.</span>
      <span class="signed-out-tab-flash">You signed out in another tab or window. <a href="">Reload</a> to refresh your session.</span>
    </div>
  </body>
</html>


export const TrackPages = {
  adventure: 'adventure',
  home: 'home',
  monster: 'monster',
  mymons: 'mymons',
  store: 'store',
  marketplace: 'marketplace',
  gym: 'gym',
  battleCastle: 'battleCastle',
  battleLadder: 'battleLadder',
  practice: 'practice',
  leaderboard: 'leaderboard',
  signin: 'signin',
};

export const FBContentTypes = {
  monster: 'monster',
  page: 'page',
};

export const VisitPage = () => {
  // typeof fbq !== 'undefined' && fbq('track', 'PageView');
  // typeof gtag !== 'undefined' && gtag('event', 'conversion', {'send_to': 'AW-813605893/43ASCLbnx34Qhcj6gwM'});
  // typeof twq !== 'undefined' && twq('track','PageView');
  // typeof gtag !== 'undefined' && gtag('config', GA_TRACKING_ID, {page_path: "/"});
};

export const ViewContent = (page, data) => {
  if (page === TrackPages.monster) {
    typeof fbq !== 'undefined' && fbq('track', 'ViewContent', {content_ids: data.mon_id, content_type: FBContentTypes.monster});
    typeof gtag !== 'undefined' && gtag('config', GA_TRACKING_ID, {page_path: `/monsters/${data.mon_id}`});
  } else {
    typeof fbq !== 'undefined' && fbq('track', 'ViewContent', {content_ids: [page], content_type: FBContentTypes.page});
    typeof gtag !== 'undefined' && gtag('config', GA_TRACKING_ID, {page_path: `/${page}`});
  }
};

export const EnableMetamask = () => {
  typeof fbq !== 'undefined' && fbq('trackCustom', 'EnableMetamask');
  typeof gtag !== 'undefined' && gtag('event', 'conversion', {'send_to': 'AW-813605893/gmKfCKyKyH4Qhcj6gwM'});
  typeof twttr !== 'undefined' && twttr.conversion.trackPid('nz51v', { tw_sale_amount: 0, tw_order_quantity: 0 });
  typeof gtag !== 'undefined' && gtag('config', GA_TRACKING_ID, {page_path: `/enable-metamask`});
};

export const CheckEtheremons = (numMons, avgLevel) => {
  if (numMons > 0) {
    typeof fbq !== 'undefined' && fbq('trackCustom', 'CheckEtheremons', {
      num_mons: numMons,
      avg_level: avgLevel,
    });
    typeof gtag !== 'undefined' && gtag('event', 'conversion', {'send_to': 'AW-813605893/Tk66CIi_3n4Qhcj6gwM'});
    typeof twttr !== 'undefined' && twttr.conversion.trackPid('nz51w', { tw_sale_amount: 0, tw_order_quantity: 0 });
    typeof gtag !== 'undefined' && gtag('config', GA_TRACKING_ID, {page_path: `/check-etheremons`});
  }
};

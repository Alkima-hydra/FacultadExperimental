import React from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import SingleEvent from '../../components/Event';

import eventImg1 from '../../assets/img/event/event-1-1.jpg';
import eventImg2 from '../../assets/img/event/event-1-2.jpg';
import eventImg3 from '../../assets/img/event/event-1-3.jpg';

const EventMain = () => {
  return (
    <main>
      <Breadcrumb title="Event" />
      <div className="it-event-2-area it-event-style-3 p-relative pt-90 pb-90">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-6 col-md-6 mb-30">
              <SingleEvent
                eventImage={eventImg1}
                eventDate="08"
                eventMonth="October"
                title="print, and publishing industries for previewing"
              />
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 mb-30">
              <SingleEvent
                eventImage={eventImg2}
                eventDate="05"
                eventMonth="October"
                title="print, and publishing industries for previewing"
              />
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 mb-30">
              <SingleEvent
                eventImage={eventImg3}
                eventDate="25"
                eventMonth="April"
                title="print, and publishing industries for previewing"
              />
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 mb-30">
              <SingleEvent
                eventImage={eventImg1}
                eventDate="08"
                eventMonth="October"
                title="print, and publishing industries for previewing"
              />
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 mb-30">
              <SingleEvent
                eventImage={eventImg2}
                eventDate="05"
                eventMonth="October"
                title="print, and publishing industries for previewing"
              />
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 mb-30">
              <SingleEvent
                eventImage={eventImg3}
                eventDate="25"
                eventMonth="April"
                title="print, and publishing industries for previewing"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default EventMain;

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import SectionTitle from '../../components/SectionTitle';
import SingleTestimonial from '../../components/Testimonial';

import testimonialBG from '../../assets/img/testimonial/testimonial-bg.jpg';

const Testimonial = () => {
  const sliderOption = {
    speed: 1500,
    loop: true,
    slidesPerView: '3',
    spaceBetween: 50,
    autoplay: {
      delay: 3000,
    },
    breakpoints: {
      1400: { slidesPerView: 3 },
      1200: { slidesPerView: 3 },
      992: { slidesPerView: 2 },
      0: { slidesPerView: 1 },
    },
  };

  return (
    <div
      className="it-testimonial-area ed-testimonial-ptb fix p-relative"
      style={{ backgroundImage: `url(${testimonialBG})` }}
    >
      <div className="container">
        <div className="it-testimonial-title-wrap mb-90">
          <div className="row justify-content-center">
            <div className="col-xl-6">
              <SectionTitle
                itemClass="it-testimonial-title-box text-center"
                subTitle="Testimonios"
                title="Construyendo una comunidad de aprendizaje continuo."
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-12">
            <div className="ed-testimonial-wrapper">
              <div className="swiper-container">
                <Swiper
                  modules={[Autoplay]}
                  {...sliderOption}
                  className="swiper-wrapper ed-testimonial-active"
                >
                  <SwiperSlide className="swiper-slide">
                    <SingleTestimonial
                      description={`“Gracias a esta plataforma pude fortalecer mis habilidades profesionales y aplicar lo aprendido en proyectos reales. La metodología es clara, práctica y muy bien estructurada.”`}
                      authorName="Ellen Perera"
                      designation="Gerente General"
                    />
                  </SwiperSlide>

                  <SwiperSlide className="swiper-slide">
                    <SingleTestimonial
                      description={`“Los cursos están actualizados y enfocados en el mercado laboral. Me ayudaron a mejorar mi perfil profesional y conseguir nuevas oportunidades.”`}
                      authorName="Kathy Sullivan"
                      designation="Directora Ejecutiva"
                    />
                  </SwiperSlide>

                  <SwiperSlide className="swiper-slide">
                    <SingleTestimonial
                      description={`“La experiencia de aprendizaje fue excelente. Los docentes explican con claridad y el contenido es muy completo. Recomiendo totalmente esta institución.”`}
                      authorName="Elsie Stroud"
                      designation="Consultora Empresarial"
                    />
                  </SwiperSlide>

                  <SwiperSlide className="swiper-slide">
                    <SingleTestimonial
                      description={`“Destaco la calidad académica y el acompañamiento constante. Es un espacio ideal para quienes desean crecer profesionalmente.”`}
                      authorName="Kathy Sullivan"
                      designation="Líder de Proyectos"
                    />
                  </SwiperSlide>

                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
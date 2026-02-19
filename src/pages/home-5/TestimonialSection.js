import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import SectionTitle from '../../components/SectionTitle';
import SingleTestimonialThree from '../../components/Testimonial/SingleTestimonialThree';

import avatarImg1 from '../../assets/img/testimonial/avatar-1-1.png';
import avatarImg2 from '../../assets/img/testimonial/avatar-1-2.png';
import avatarImg3 from '../../assets/img/testimonial/avatar-1-3.png';

const Testimonial = () => {
  const sliderOption = {
    speed: 1500,
    loop: true,
    slidesPerView: '3',
    spaceBetween: 50,
    autoplay: {
      delay: 5000,
    },
    breakpoints: {
      1400: {
        slidesPerView: 3,
      },
      992: {
        slidesPerView: 2,
      },
      0: {
        slidesPerView: 1,
      },
    },
  };

  return (
    <div className="it-testimonial-area ed-testimonial-style-2 pt-120 pb-120 fix p-relative">
      <div className="container">
        <div className="it-testimonial-title-wrap mb-65">
          <div className="row justify-content-center">
            <div className="col-xl-6">
              <SectionTitle
                itemClass="it-testimonial-title-box text-center"
                subTitleClass="ed-section-subtitle"
                subTitle="Testimonios"
                titleClass="ed-section-title"
                title="Construyendo una comunidad de aprendizaje continuo."
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-12">
            <div className="ed-testimonial-wrapper">
              <div className="swiper-container ed-testimonial-active">
                <Swiper
                  modules={[Autoplay]}
                  {...sliderOption}
                  className="swiper-wrapper"
                >
                  <SwiperSlide className="swiper-slide">
                    <SingleTestimonialThree
                      description={`“La plataforma me ayudó a aprender de forma práctica y ordenada. Los contenidos están bien explicados y pude avanzar con confianza desde lo básico hasta temas más avanzados.”`}
                      authorAvatar={avatarImg1}
                      authorName="Ellen Perera"
                      designation="Gerente General"
                    />
                  </SwiperSlide>

                  <SwiperSlide className="swiper-slide">
                    <SingleTestimonialThree
                      description={`“Los cursos son claros, actuales y muy aplicables. Lo mejor fue el enfoque en proyectos, porque me permitió armar un portafolio real para postular a oportunidades.”`}
                      authorAvatar={avatarImg2}
                      authorName="Kathy Sullivan"
                      designation="Directora Ejecutiva"
                    />
                  </SwiperSlide>

                  <SwiperSlide className="swiper-slide">
                    <SingleTestimonialThree
                      description={`“Me gustó el acompañamiento y la estructura de cada módulo. No es contenido suelto: te guía paso a paso y te deja con bases sólidas para seguir creciendo.”`}
                      authorAvatar={avatarImg3}
                      authorName="Elsie Stroud"
                      designation="Consultora Empresarial"
                    />
                  </SwiperSlide>

                  <SwiperSlide className="swiper-slide">
                    <SingleTestimonialThree
                      description={`“La experiencia fue excelente: material actualizado, clases dinámicas y recursos que realmente ayudan a aprender. Lo recomiendo totalmente.”`}
                      authorAvatar={avatarImg1}
                      authorName="Ellen Perera"
                      designation="Líder de Proyectos"
                    />
                  </SwiperSlide>

                  <SwiperSlide className="swiper-slide">
                    <SingleTestimonialThree
                      description={`“Aprendí más rápido de lo que esperaba. La plataforma es fácil de usar y la metodología hace que el progreso se sienta claro y medible.”`}
                      authorAvatar={avatarImg2}
                      authorName="Kathy Sullivan"
                      designation="Coordinadora Académica"
                    />
                  </SwiperSlide>

                  <SwiperSlide className="swiper-slide">
                    <SingleTestimonialThree
                      description={`“Excelente calidad. Me sirvió tanto para reforzar conceptos como para prepararme mejor para evaluaciones y entrevistas.”`}
                      authorAvatar={avatarImg1}
                      authorName="Ellen Perera"
                      designation="Profesional en formación"
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
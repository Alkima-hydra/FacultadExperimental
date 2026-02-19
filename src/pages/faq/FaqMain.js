import React from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import FaqOne from '../../components/Faq';

import faqImg from '../../assets/img/faq/thumb-1.jpg';

const FaqMain = () => {
  const items = [
    {
      id: 'a',
      btnText: '¿Por qué los estudiantes prefieren el aprendizaje en línea?',
      description:
        'Porque ofrece flexibilidad para estudiar a tu ritmo, desde cualquier lugar y con horarios adaptados a tu rutina. Además, permite acceder a recursos actualizados, repasar las clases cuando lo necesites y combinar estudio con trabajo u otras responsabilidades.',
      faqImage: faqImg,
    },
    {
      id: 'b',
      btnText: '¿Qué debo considerar si quiero estudiar en el extranjero?',
      description:
        'Lo más importante es definir tu objetivo (idioma, carrera, intercambio), revisar los requisitos de admisión, presupuesto, opciones de becas y el costo de vida. También conviene comparar la calidad de la institución, la ciudad, el clima, la seguridad y las oportunidades académicas o laborales.',
      faqImage: faqImg,
    },
    {
      id: 'c',
      btnText: '¿Cómo puedo contactar a la universidad o instituto directamente?',
      description:
        'Puedes escribir al correo institucional, usar el formulario de contacto del sitio web o comunicarte por teléfono. Muchas instituciones también atienden por redes sociales. Si buscas una respuesta rápida, lo ideal es enviar un mensaje con tu nombre, el programa de interés y tus preguntas específicas.',
      faqImage: faqImg,
    },
    {
      id: 'd',
      btnText: '¿Cómo encuentro una institución adecuada para lo que quiero estudiar?',
      description:
        'Empieza por identificar el área y el nivel (técnico, licenciatura, posgrado). Luego compara malla curricular, duración, modalidad (presencial/virtual), reputación, acreditaciones y opiniones de estudiantes. También revisa si el programa ofrece prácticas, proyectos y apoyo académico.',
      faqImage: faqImg,
    },
    {
      id: 'e',
      btnText: '¿Qué hago si tengo dudas antes de inscribirme?',
      description:
        'Lo mejor es pedir información oficial: requisitos, costos, horarios, plan de estudios y fechas de inicio. Si puedes, solicita una orientación o asesoría. Así tomas una decisión informada y evitas sorpresas con pagos, materias o trámites.',
      faqImage: faqImg,
    },
  ];

  return (
    <main>
      <Breadcrumb title="Preguntas frecuentes" />

      <div className="it-faq-area p-relative pt-120 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="it-faq-wrap">
                <FaqOne
                  itemClass="it-custom-accordion it-custom-accordion-style-3 inner-style"
                  items={items}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FaqMain;
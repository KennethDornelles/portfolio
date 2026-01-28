import { PrismaClient, LanguageCode } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding translations...');

  const translations = [
    // Navbar
    { key: 'NAV_HOME', lang: 'EN_US', value: 'Home' },
    { key: 'NAV_HOME', lang: 'PT_BR', value: 'Início' },
    { key: 'NAV_PROJECTS', lang: 'EN_US', value: 'Projects' },
    { key: 'NAV_PROJECTS', lang: 'PT_BR', value: 'Projetos' },
    { key: 'NAV_SERVICES', lang: 'EN_US', value: 'Services' },
    { key: 'NAV_SERVICES', lang: 'PT_BR', value: 'Serviços' },
    { key: 'NAV_ABOUT', lang: 'EN_US', value: 'About' },
    { key: 'NAV_ABOUT', lang: 'PT_BR', value: 'Sobre' },
    { key: 'NAV_DEMO', lang: 'EN_US', value: 'Demo Mode' },
    { key: 'NAV_DEMO', lang: 'PT_BR', value: 'Modo Demo' },

    // Home
    { key: 'HOME_BADGE', lang: 'EN_US', value: 'Available for new projects' },
    { key: 'HOME_BADGE', lang: 'PT_BR', value: 'Disponível para novos projetos' },
    { key: 'HOME_HERO_TITLE_PREFIX', lang: 'EN_US', value: 'Building the' },
    { key: 'HOME_HERO_TITLE_PREFIX', lang: 'PT_BR', value: 'Construindo o' },
    { key: 'HOME_HERO_TITLE_HIGHLIGHT', lang: 'EN_US', value: 'Future' },
    { key: 'HOME_HERO_TITLE_HIGHLIGHT', lang: 'PT_BR', value: 'Futuro' },
    { key: 'HOME_HERO_TITLE_SUFFIX', lang: 'EN_US', value: 'of Digital Experience' },
    { key: 'HOME_HERO_TITLE_SUFFIX', lang: 'PT_BR', value: 'da Experiência Digital' },
    { key: 'HOME_HERO_DESC', lang: 'EN_US', value: 'Specialized in High-Performance Web Applications and Scalable Backend Systems. Minimalist design meets robust engineering.' },
    { key: 'HOME_HERO_DESC', lang: 'PT_BR', value: 'Especializado em Aplicações Web de Alta Performance e Sistemas Backend Escaláveis. Design minimalista encontra engenharia robusta.' },
    { key: 'BTN_VIEW_PROJECTS', lang: 'EN_US', value: 'View Projects' },
    { key: 'BTN_VIEW_PROJECTS', lang: 'PT_BR', value: 'Ver Projetos' },
    { key: 'BTN_CONTACT', lang: 'EN_US', value: 'Contact Me' },
    { key: 'BTN_CONTACT', lang: 'PT_BR', value: 'Contato' },
    { key: 'BTN_SEND', lang: 'EN_US', value: 'Send Message' },
    { key: 'BTN_SEND', lang: 'PT_BR', value: 'Enviar Mensagem' },

    // Projects Page
    { key: 'PROJECTS_TITLE', lang: 'EN_US', value: 'My Projects' },
    { key: 'PROJECTS_TITLE', lang: 'PT_BR', value: 'Meus Projetos' },
    { key: 'PROJECTS_SUBTITLE', lang: 'EN_US', value: 'A collection of my recent work and side projects.' },
    { key: 'PROJECTS_SUBTITLE', lang: 'PT_BR', value: 'Uma coleção dos meus trabalhos recentes e projetos pessoais.' },
    { key: 'PROJECTS_EMPTY_TITLE', lang: 'EN_US', value: 'Projects Coming Soon' },
    { key: 'PROJECTS_EMPTY_TITLE', lang: 'PT_BR', value: 'Projetos em Breve' },
    { key: 'PROJECTS_EMPTY_DESC', lang: 'EN_US', value: 'New projects are being added. Check back soon!' },
    { key: 'PROJECTS_EMPTY_DESC', lang: 'PT_BR', value: 'Novos projetos estão sendo adicionados. Volte em breve!' },

    // Services Page
    { key: 'SERVICES_TITLE', lang: 'EN_US', value: 'Services' },
    { key: 'SERVICES_TITLE', lang: 'PT_BR', value: 'Serviços' },
    { key: 'SERVICES_SUBTITLE', lang: 'EN_US', value: 'End-to-end solutions for your digital needs.' },
    { key: 'SERVICES_SUBTITLE', lang: 'PT_BR', value: 'Soluções completas para suas necessidades digitais.' },
    { key: 'SERVICE_WEB_TITLE', lang: 'EN_US', value: 'Web Development' },
    { key: 'SERVICE_WEB_TITLE', lang: 'PT_BR', value: 'Desenvolvimento Web' },
    { key: 'SERVICE_WEB_DESC', lang: 'EN_US', value: 'Modern, responsive web applications using Angular, React, and cutting-edge technologies.' },
    { key: 'SERVICE_WEB_DESC', lang: 'PT_BR', value: 'Aplicações web modernas e responsivas usando Angular, React e tecnologias de ponta.' },
    { key: 'SERVICE_API_TITLE', lang: 'EN_US', value: 'API Development' },
    { key: 'SERVICE_API_TITLE', lang: 'PT_BR', value: 'Desenvolvimento de APIs' },
    { key: 'SERVICE_API_DESC', lang: 'EN_US', value: 'RESTful and GraphQL APIs with NestJS, Node.js, and robust authentication.' },
    { key: 'SERVICE_API_DESC', lang: 'PT_BR', value: 'APIs RESTful e GraphQL com NestJS, Node.js e autenticação robusta.' },
    { key: 'SERVICE_MOBILE_TITLE', lang: 'EN_US', value: 'Mobile Apps' },
    { key: 'SERVICE_MOBILE_TITLE', lang: 'PT_BR', value: 'Apps Mobile' },
    { key: 'SERVICE_MOBILE_DESC', lang: 'EN_US', value: 'Cross-platform mobile applications with React Native and Flutter.' },
    { key: 'SERVICE_MOBILE_DESC', lang: 'PT_BR', value: 'Aplicativos mobile multiplataforma com React Native e Flutter.' },
    { key: 'SERVICE_DB_TITLE', lang: 'EN_US', value: 'Database Design' },
    { key: 'SERVICE_DB_TITLE', lang: 'PT_BR', value: 'Design de Banco de Dados' },
    { key: 'SERVICE_DB_DESC', lang: 'EN_US', value: 'Efficient database architecture with PostgreSQL, MongoDB, and Redis.' },
    { key: 'SERVICE_DB_DESC', lang: 'PT_BR', value: 'Arquitetura de banco de dados eficiente com PostgreSQL, MongoDB e Redis.' },
    { key: 'SERVICE_CLOUD_TITLE', lang: 'EN_US', value: 'Cloud & DevOps' },
    { key: 'SERVICE_CLOUD_TITLE', lang: 'PT_BR', value: 'Cloud & DevOps' },
    { key: 'SERVICE_CLOUD_DESC', lang: 'EN_US', value: 'AWS, Docker, CI/CD pipelines, and infrastructure automation.' },
    { key: 'SERVICE_CLOUD_DESC', lang: 'PT_BR', value: 'AWS, Docker, pipelines CI/CD e automação de infraestrutura.' },
    { key: 'SERVICE_SECURITY_TITLE', lang: 'EN_US', value: 'Security' },
    { key: 'SERVICE_SECURITY_TITLE', lang: 'PT_BR', value: 'Segurança' },
    { key: 'SERVICE_SECURITY_DESC', lang: 'EN_US', value: 'Secure authentication, encryption, and vulnerability assessments.' },
    { key: 'SERVICE_SECURITY_DESC', lang: 'PT_BR', value: 'Autenticação segura, criptografia e avaliação de vulnerabilidades.' },
    { key: 'SERVICES_CTA_TITLE', lang: 'EN_US', value: 'Ready to Start?' },
    { key: 'SERVICES_CTA_TITLE', lang: 'PT_BR', value: 'Pronto para Começar?' },
    { key: 'SERVICES_CTA_DESC', lang: 'EN_US', value: 'Let\'s discuss your project and find the best solution together.' },
    { key: 'SERVICES_CTA_DESC', lang: 'PT_BR', value: 'Vamos discutir seu projeto e encontrar a melhor solução juntos.' },

    // About Page
    { key: 'ABOUT_ROLE', lang: 'EN_US', value: 'Fullstack Developer & Consultant' },
    { key: 'ABOUT_ROLE', lang: 'PT_BR', value: 'Desenvolvedor Fullstack & Consultor' },
    { key: 'ABOUT_BIO', lang: 'EN_US', value: 'Passionate about building scalable software solutions that make a difference. With 5+ years of experience in web development, I specialize in creating high-performance applications using modern technologies.' },
    { key: 'ABOUT_BIO', lang: 'PT_BR', value: 'Apaixonado por construir soluções de software escaláveis que fazem a diferença. Com mais de 5 anos de experiência em desenvolvimento web, me especializo em criar aplicações de alta performance usando tecnologias modernas.' },
    { key: 'ABOUT_SKILLS_TITLE', lang: 'EN_US', value: 'Skills & Technologies' },
    { key: 'ABOUT_SKILLS_TITLE', lang: 'PT_BR', value: 'Habilidades & Tecnologias' },
    { key: 'ABOUT_STAT_YEARS', lang: 'EN_US', value: 'Years Experience' },
    { key: 'ABOUT_STAT_YEARS', lang: 'PT_BR', value: 'Anos de Experiência' },
    { key: 'ABOUT_STAT_PROJECTS', lang: 'EN_US', value: 'Projects Delivered' },
    { key: 'ABOUT_STAT_PROJECTS', lang: 'PT_BR', value: 'Projetos Entregues' },
    { key: 'ABOUT_STAT_CLIENTS', lang: 'EN_US', value: 'Happy Clients' },
    { key: 'ABOUT_STAT_CLIENTS', lang: 'PT_BR', value: 'Clientes Satisfeitos' },
    { key: 'ABOUT_STAT_COFFEE', lang: 'EN_US', value: 'Cups of Coffee' },
    { key: 'ABOUT_STAT_COFFEE', lang: 'PT_BR', value: 'Xícaras de Café' },

    // Contact Page
    { key: 'CONTACT_TITLE', lang: 'EN_US', value: 'Get in Touch' },
    { key: 'CONTACT_TITLE', lang: 'PT_BR', value: 'Entre em Contato' },
    { key: 'CONTACT_SUBTITLE', lang: 'EN_US', value: 'Have a project in mind? Let\'s talk!' },
    { key: 'CONTACT_SUBTITLE', lang: 'PT_BR', value: 'Tem um projeto em mente? Vamos conversar!' },
    { key: 'CONTACT_NAME', lang: 'EN_US', value: 'Your Name' },
    { key: 'CONTACT_NAME', lang: 'PT_BR', value: 'Seu Nome' },
    { key: 'CONTACT_NAME_PLACEHOLDER', lang: 'EN_US', value: 'John Doe' },
    { key: 'CONTACT_NAME_PLACEHOLDER', lang: 'PT_BR', value: 'João Silva' },
    { key: 'CONTACT_EMAIL', lang: 'EN_US', value: 'Email' },
    { key: 'CONTACT_EMAIL', lang: 'PT_BR', value: 'Email' },
    { key: 'CONTACT_SUBJECT', lang: 'EN_US', value: 'Subject' },
    { key: 'CONTACT_SUBJECT', lang: 'PT_BR', value: 'Assunto' },
    { key: 'CONTACT_SUBJECT_PLACEHOLDER', lang: 'EN_US', value: 'Project inquiry' },
    { key: 'CONTACT_SUBJECT_PLACEHOLDER', lang: 'PT_BR', value: 'Consulta sobre projeto' },
    { key: 'CONTACT_MESSAGE', lang: 'EN_US', value: 'Message' },
    { key: 'CONTACT_MESSAGE', lang: 'PT_BR', value: 'Mensagem' },
    { key: 'CONTACT_MESSAGE_PLACEHOLDER', lang: 'EN_US', value: 'Tell me about your project...' },
    { key: 'CONTACT_MESSAGE_PLACEHOLDER', lang: 'PT_BR', value: 'Conte-me sobre seu projeto...' },
    { key: 'CONTACT_SUCCESS_TITLE', lang: 'EN_US', value: 'Message Sent!' },
    { key: 'CONTACT_SUCCESS_TITLE', lang: 'PT_BR', value: 'Mensagem Enviada!' },
    { key: 'CONTACT_SUCCESS_DESC', lang: 'EN_US', value: 'Thank you! I will get back to you soon.' },
    { key: 'CONTACT_SUCCESS_DESC', lang: 'PT_BR', value: 'Obrigado! Retornarei em breve.' },
    { key: 'CONTACT_ALT', lang: 'EN_US', value: 'Or email me directly at:' },
    { key: 'CONTACT_ALT', lang: 'PT_BR', value: 'Ou envie um email diretamente para:' },
  ];

  for (const t of translations) {
    // 1. Ensure Key exists
    let keyRecord = await prisma.translationKey.findUnique({ where: { key: t.key } });
    if (!keyRecord) {
      keyRecord = await prisma.translationKey.create({ data: { key: t.key } });
    }

    // 2. Upsert Translation
    await prisma.translation.upsert({
      where: {
        keyId_language: {
          keyId: keyRecord.id,
          language: t.lang as LanguageCode
        }
      },
      update: { value: t.value },
      create: {
        keyId: keyRecord.id,
        language: t.lang as LanguageCode,
        value: t.value
      }
    });
  }

  console.log('Translations seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

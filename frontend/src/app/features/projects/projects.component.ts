import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ProjectHighlight {
  title: string;
  description: string;
}

interface Project {
  name: string;
  tagline: string;
  problem: string;
  solution: string;
  highlights: ProjectHighlight[];
  techStack: string[];
  githubUrl: string;
  color: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        
        <!-- Header -->
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-2 bg-tech-blue/10 text-tech-blue rounded-full text-sm font-medium uppercase tracking-wider mb-4">
            Portfolio
          </span>
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
            Projetos <span class="text-transparent bg-clip-text bg-gradient-to-r from-tech-blue to-purple-500">em Destaque</span>
          </h1>
          <p class="text-gray-400 text-lg max-w-2xl mx-auto">
            Soluções reais desenvolvidas com foco em arquitetura escalável, performance e experiência do usuário.
          </p>
        </div>

        <!-- Projects Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          @for (project of projects; track project.name) {
            <article class="group relative bg-gradient-to-br from-white/5 to-transparent rounded-3xl border border-white/10 overflow-hidden hover:border-tech-blue/30 transition-all duration-500">
              <!-- Gradient Overlay -->
              <div class="absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity"
                   [class]="project.color === 'orange' ? 'from-orange-500 to-red-500' : 'from-purple-500 to-blue-500'"></div>
              
              <div class="relative p-8">
                <!-- Header -->
                <div class="flex items-start justify-between mb-6">
                  <div>
                    <span class="text-xs text-gray-500 uppercase tracking-widest">Case Study</span>
                    <h2 class="text-2xl md:text-3xl font-bold text-white mt-1">{{ project.name }}</h2>
                    <p class="text-gray-400 text-sm mt-1">{{ project.tagline }}</p>
                  </div>
                  <a [href]="project.githubUrl" target="_blank" 
                     class="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>

                <!-- Problem & Solution -->
                <div class="space-y-4 mb-6">
                  <div class="p-4 bg-red-500/5 rounded-xl border border-red-500/10">
                    <span class="text-red-400 text-xs font-medium uppercase tracking-wider">O Problema</span>
                    <p class="text-gray-300 text-sm mt-1">{{ project.problem }}</p>
                  </div>
                  <div class="p-4 bg-green-500/5 rounded-xl border border-green-500/10">
                    <span class="text-green-400 text-xs font-medium uppercase tracking-wider">A Solução</span>
                    <p class="text-gray-300 text-sm mt-1">{{ project.solution }}</p>
                  </div>
                </div>

                <!-- Highlights -->
                <div class="mb-6">
                  <h4 class="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Destaques Técnicos</h4>
                  <div class="space-y-3">
                    @for (highlight of project.highlights; track highlight.title) {
                      <div class="flex gap-3">
                        <span class="text-tech-blue mt-1">▸</span>
                        <div>
                          <span class="text-white font-medium">{{ highlight.title }}:</span>
                          <span class="text-gray-400 text-sm"> {{ highlight.description }}</span>
                        </div>
                      </div>
                    }
                  </div>
                </div>

                <!-- Tech Stack -->
                <div class="flex flex-wrap gap-2">
                  @for (tech of project.techStack; track tech) {
                    <span class="px-3 py-1 bg-white/5 text-gray-300 text-xs rounded-full border border-white/10">
                      {{ tech }}
                    </span>
                  }
                </div>
              </div>
            </article>
          }
        </div>

        <!-- Code Snippets Section -->
        <div class="mb-16">
          <div class="text-center mb-12">
            <h2 class="text-2xl md:text-3xl font-bold text-white">
              Featured <span class="text-tech-blue">Code</span>
            </h2>
            <p class="text-gray-400 mt-2">Exemplos de implementação dos projetos</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- BarberBoss Snippet -->
            <div class="rounded-2xl overflow-hidden border border-white/10">
              <div class="bg-graphite-900 px-4 py-3 flex items-center justify-between border-b border-white/10">
                <div class="flex items-center gap-2">
                  <div class="flex gap-1.5">
                    <span class="w-3 h-3 rounded-full bg-red-500"></span>
                    <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span class="w-3 h-3 rounded-full bg-green-500"></span>
                  </div>
                  <span class="text-gray-400 text-sm ml-2">appointments.service.ts</span>
                </div>
                <span class="text-xs text-orange-400 font-medium">BarberBoss</span>
              </div>
              <pre class="bg-graphite-950 p-4 overflow-x-auto text-sm"><code class="text-gray-300"><span class="text-purple-400">&#64;Injectable</span>()
<span class="text-blue-400">export class</span> <span class="text-yellow-300">AppointmentsService</span> &#123;
  <span class="text-blue-400">constructor</span>(
    <span class="text-blue-400">private</span> prisma: <span class="text-yellow-300">PrismaService</span>,
    <span class="text-blue-400">private</span> notifications: <span class="text-yellow-300">NotificationsService</span>
  ) &#123;&#125;

  <span class="text-blue-400">async</span> <span class="text-green-400">createAppointment</span>(dto: <span class="text-yellow-300">CreateAppointmentDto</span>) &#123;
    <span class="text-gray-500">// Verificar conflitos de horário</span>
    <span class="text-blue-400">const</span> conflict = <span class="text-blue-400">await</span> <span class="text-purple-400">this</span>.prisma.appointment
      .<span class="text-green-400">findFirst</span>(&#123;
        <span class="text-orange-300">where</span>: &#123;
          <span class="text-orange-300">barberId</span>: dto.barberId,
          <span class="text-orange-300">startTime</span>: &#123; <span class="text-orange-300">lte</span>: dto.endTime &#125;,
          <span class="text-orange-300">endTime</span>: &#123; <span class="text-orange-300">gte</span>: dto.startTime &#125;
        &#125;
      &#125;);

    <span class="text-blue-400">if</span> (conflict) <span class="text-blue-400">throw new</span> <span class="text-yellow-300">ConflictException</span>();

    <span class="text-blue-400">const</span> appointment = <span class="text-blue-400">await</span> <span class="text-purple-400">this</span>.prisma
      .appointment.<span class="text-green-400">create</span>(&#123; <span class="text-orange-300">data</span>: dto &#125;);
    
    <span class="text-blue-400">await</span> <span class="text-purple-400">this</span>.notifications.<span class="text-green-400">sendConfirmation</span>(
      appointment
    );
    
    <span class="text-blue-400">return</span> appointment;
  &#125;
&#125;</code></pre>
            </div>

            <!-- PetBoss Snippet -->
            <div class="rounded-2xl overflow-hidden border border-white/10">
              <div class="bg-graphite-900 px-4 py-3 flex items-center justify-between border-b border-white/10">
                <div class="flex items-center gap-2">
                  <div class="flex gap-1.5">
                    <span class="w-3 h-3 rounded-full bg-red-500"></span>
                    <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span class="w-3 h-3 rounded-full bg-green-500"></span>
                  </div>
                  <span class="text-gray-400 text-sm ml-2">geolocation.service.ts</span>
                </div>
                <span class="text-xs text-purple-400 font-medium">PetBoss</span>
              </div>
              <pre class="bg-graphite-950 p-4 overflow-x-auto text-sm"><code class="text-gray-300"><span class="text-purple-400">&#64;Injectable</span>()
<span class="text-blue-400">export class</span> <span class="text-yellow-300">GeolocationService</span> &#123;
  <span class="text-blue-400">constructor</span>(
    <span class="text-blue-400">private</span> prisma: <span class="text-yellow-300">PrismaService</span>
  ) &#123;&#125;

  <span class="text-blue-400">async</span> <span class="text-green-400">findNearbyStores</span>(
    lat: <span class="text-blue-400">number</span>,
    lng: <span class="text-blue-400">number</span>,
    radiusKm: <span class="text-blue-400">number</span> = <span class="text-orange-300">10</span>
  ) &#123;
    <span class="text-gray-500">// PostGIS: ST_DWithin para busca otimizada</span>
    <span class="text-blue-400">return</span> <span class="text-purple-400">this</span>.prisma.<span class="text-green-400">$queryRaw</span>&#96;
      <span class="text-green-300">SELECT</span> id, name, address,
        <span class="text-yellow-300">ST_Distance</span>(
          location,
          <span class="text-yellow-300">ST_SetSRID</span>(
            <span class="text-yellow-300">ST_MakePoint</span>($&#123;lng&#125;, $&#123;lat&#125;), 
            <span class="text-orange-300">4326</span>
          )
        ) <span class="text-green-300">AS</span> distance
      <span class="text-green-300">FROM</span> stores
      <span class="text-green-300">WHERE</span> <span class="text-yellow-300">ST_DWithin</span>(
        location,
        <span class="text-yellow-300">ST_SetSRID</span>(
          <span class="text-yellow-300">ST_MakePoint</span>($&#123;lng&#125;, $&#123;lat&#125;),
          <span class="text-orange-300">4326</span>
        ),
        $&#123;radiusKm * <span class="text-orange-300">1000</span>&#125;
      )
      <span class="text-green-300">ORDER BY</span> distance
      <span class="text-green-300">LIMIT</span> <span class="text-orange-300">20</span>
    &#96;;
  &#125;
&#125;</code></pre>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="text-center">
          <p class="text-gray-400 mb-4">Quer ver mais do meu trabalho?</p>
          <a href="https://github.com/KennethDornelles" target="_blank"
             class="inline-flex items-center gap-2 px-6 py-3 bg-white/5 text-white border border-white/10 rounded-full hover:bg-white/10 transition-all">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Ver GitHub Completo
          </a>
        </div>
      </div>
    </section>
  `
})
export class ProjectsComponent {
  projects: Project[] = [
    {
      name: 'BarberBoss',
      tagline: 'Gestão e Experiência Mobile em Tempo Real',
      problem: 'A dificuldade de barbearias em gerenciar agendas e fidelizar clientes em um ambiente competitivo e dinâmico.',
      solution: 'Uma plataforma mobile completa construída com React Native e NestJS, focada em automatizar o fluxo de agendamento e a gestão de horários.',
      highlights: [
        {
          title: 'Agendamento Inteligente',
          description: 'Sistema em tempo real integrado ao backend NestJS, garantindo zero conflitos de agenda.'
        },
        {
          title: 'Gamificação e Fidelidade',
          description: 'Implementação de um sistema de pontos e recompensas para aumentar a retenção de clientes.'
        },
        {
          title: 'Infraestrutura Automatizada',
          description: 'Uso de GitHub Actions para automação de processos e PostgreSQL/Prisma para garantir a integridade dos dados operacionais.'
        }
      ],
      techStack: ['React Native', 'NestJS', 'PostgreSQL', 'Prisma', 'GitHub Actions'],
      githubUrl: 'https://github.com/KennethOlusegun/barberBoss',
      color: 'orange'
    },
    {
      name: 'PetBoss',
      tagline: 'Ecossistema Multi-tenant e Geolocalização',
      problem: 'A necessidade de uma gestão centralizada para petshops que desejam oferecer uma experiência premium aos tutores de pets.',
      solution: 'Uma plataforma robusta e multi-tenant que integra desde a gestão de estoque e agendamentos até a localização de serviços próximos.',
      highlights: [
        {
          title: 'Arquitetura Multi-tenant',
          description: 'Backend escalável em NestJS preparado para servir múltiplas unidades de negócio em um único ecossistema.'
        },
        {
          title: 'Geolocalização Avançada',
          description: 'Uso de inteligência de dados para localização de lojas e serviços "próximos a mim" (preparado para PostGIS).'
        },
        {
          title: 'Comunicação Otimizada',
          description: 'Sistema de notificações multicanal (WhatsApp/Push) gerenciado por filas (BullMQ) para garantir alta performance.'
        },
        {
          title: 'Design High-Tech',
          description: 'Interface mobile desenvolvida com NativeWind, seguindo uma estética moderna e imersiva.'
        }
      ],
      techStack: ['NestJS', 'PostgreSQL', 'PostGIS', 'BullMQ', 'NativeWind', 'React Native'],
      githubUrl: 'https://github.com/KennethDornelles/HobbyBichos',
      color: 'purple'
    }
  ];
}

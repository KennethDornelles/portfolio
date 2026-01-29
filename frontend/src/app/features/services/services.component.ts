import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

interface ServiceItem {
  title: string;
  description: string;
}

interface ServiceCategory {
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  borderColor: string;
  items: ServiceItem[];
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        
        <!-- Header -->
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-2 bg-tech-blue/10 text-tech-blue rounded-full text-sm font-medium uppercase tracking-wider mb-4">
            Serviços
          </span>
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
            Soluções <span class="text-transparent bg-clip-text bg-gradient-to-r from-tech-blue to-purple-500">sob medida</span>
          </h1>
          <p class="text-gray-400 text-lg max-w-2xl mx-auto">
            Do planejamento à entrega, ofereço consultoria e desenvolvimento com foco em qualidade, performance e escalabilidade.
          </p>
        </div>

        <!-- Services Grid -->
        <div class="space-y-12">
          @for (category of services; track category.title) {
            <div class="group">
              <!-- Category Header -->
              <div class="flex items-center gap-4 mb-6">
                <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                     [class]="'bg-' + category.color + '/10'">
                  {{ category.icon }}
                </div>
                <div>
                  <h2 class="text-2xl md:text-3xl font-bold text-white">{{ category.title }}</h2>
                  <p class="text-gray-400 text-sm">{{ category.subtitle }}</p>
                </div>
              </div>

              <!-- Category Items -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pl-0 md:pl-[4.5rem]">
                @for (item of category.items; track item.title) {
                  <div class="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-tech-blue/30 transition-all duration-300 hover:-translate-y-1">
                    <h3 class="text-lg font-bold text-white mb-2">{{ item.title }}</h3>
                    <p class="text-gray-400 text-sm leading-relaxed">{{ item.description }}</p>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <!-- CTA Section -->
        <div class="mt-20 text-center">
          <div class="inline-block p-8 md:p-12 bg-gradient-to-br from-tech-blue/10 via-purple-500/5 to-transparent rounded-3xl border border-white/10">
            <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">Precisa de um desses serviços?</h3>
            <p class="text-gray-400 mb-8 max-w-lg mx-auto">
              Vamos conversar sobre seu projeto e encontrar a melhor solução para o seu negócio.
            </p>
            <a routerLink="/contact" class="inline-block px-8 py-4 bg-tech-blue text-black font-bold rounded-full hover:bg-tech-blue/80 transition-all hover:scale-105">
              Solicitar Orçamento
            </a>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ServicesComponent {
  langService = inject(LanguageService);

  services: ServiceCategory[] = [
    {
      icon: '💻',
      title: 'Desenvolvimento de Aplicações Web & Mobile',
      subtitle: 'Robustez com Angular 19 e NestJS',
      color: 'tech-blue',
      borderColor: 'tech-blue',
      items: [
        {
          title: 'Aplicações Full Stack',
          description: 'Desenvolvimento de ponta a ponta, do banco de dados à interface do usuário, utilizando as versões mais recentes do Angular e NestJS.'
        },
        {
          title: 'Dashboards e Painéis Administrativos',
          description: 'Criação de interfaces complexas com gerenciamento de estado via Signals e alta performance.'
        },
        {
          title: 'Soluções Escaláveis',
          description: 'Foco em arquiteturas que suportam o crescimento do negócio, seguindo princípios de Clean Architecture.'
        }
      ]
    },
    {
      icon: '🏗️',
      title: 'Consultoria em Arquitetura de Backend',
      subtitle: 'Inteligência técnica, não apenas código',
      color: 'purple-500',
      borderColor: 'purple-500',
      items: [
        {
          title: 'Modelagem de Dados Profissional',
          description: 'Estruturação de bancos de dados relacionais (PostgreSQL, Oracle, SQL) com foco em performance e integridade.'
        },
        {
          title: 'Integração de APIs e Microserviços',
          description: 'Desenvolvimento de ecossistemas conectados, seguros e bem documentados com Swagger/OpenAPI.'
        },
        {
          title: 'Segurança e Auditoria',
          description: 'Implementação de fluxos de autenticação robustos (JWT/Refresh Token) e sistemas de log de auditoria para conformidade empresarial.'
        }
      ]
    },
    {
      icon: '📍',
      title: 'Soluções de Geolocalização',
      subtitle: 'O diferencial do PetBoss',
      color: 'green-500',
      borderColor: 'green-500',
      items: [
        {
          title: 'Sistemas de Busca por Proximidade',
          description: 'Implementação de buscas geográficas avançadas utilizando PostgreSQL com PostGIS.'
        },
        {
          title: 'Mapas Interativos',
          description: 'Integração de mapas dinâmicos no frontend para visualização de dados espaciais em tempo real.'
        }
      ]
    },
    {
      icon: '🌍',
      title: 'Internacionalização de Software (i18n)',
      subtitle: 'Produtos prontos para o mercado global',
      color: 'orange-500',
      borderColor: 'orange-500',
      items: [
        {
          title: 'Sistemas Multi-idiomas Dinâmicos',
          description: 'Estruturação de aplicações preparadas para o mercado internacional, com troca de idioma em tempo real sem necessidade de reload.'
        }
      ]
    }
  ];

}

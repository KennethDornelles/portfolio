import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { PersonalInfoModule } from './modules/personal-info/personal-info.module';
import { ServiceModule } from './modules/service/service.module';
import { SkillModule } from './modules/skill/skill.module';
import { ProjectModule } from './modules/project/project.module';
import { EducationModule } from './modules/education/education.module';
import { ExperienceModule } from './modules/experience/experience.module';
import { TestimonialModule } from './modules/testimonial/testimonial.module';
import { ContactMessageModule } from './modules/contact-message/contact-message.module';
import { SocialLinkModule } from './modules/social-link/social-link.module';
import { CodeExampleModule } from './modules/code-example/code-example.module';
import { configuration, validationSchema } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [{
        ttl: config.get('throttle.ttl'),
        limit: config.get('throttle.limit'),
      }],
    }),
    DatabaseModule,
    HealthModule,
    PersonalInfoModule,
    ServiceModule,
    SkillModule,
    ProjectModule,
    EducationModule,
    ExperienceModule,
    TestimonialModule,
    ContactMessageModule,
    SocialLinkModule,
    CodeExampleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

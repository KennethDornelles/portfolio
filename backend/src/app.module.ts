import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonalInfoModule } from './modules/personal-info/personal-info.module';
import { ServiceModule } from './service/service.module';
import { SkillModule } from './skill/skill.module';
import { ProjectModule } from './project/project.module';
import { EducationModule } from './education/education.module';
import { TestimonialModule } from './testimonial/testimonial.module';
import { ContactMessageModule } from './contact-message/contact-message.module';
import { SocialLinkModule } from './social-link/social-link.module';
import { CodeExampleModule } from './code-example/code-example.module';

@Module({
  imports: [PersonalInfoModule, ServiceModule, SkillModule, ProjectModule, EducationModule, TestimonialModule, ContactMessageModule, SocialLinkModule, CodeExampleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

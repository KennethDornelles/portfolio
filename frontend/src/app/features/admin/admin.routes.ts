import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectsAdminComponent } from './pages/projects-admin/projects-admin.component';
import { ContactsAdminComponent } from './pages/contacts-admin/contacts-admin.component';
import { TranslationsAdminComponent } from './pages/translations-admin/translations-admin.component';
import { TechnologiesAdminComponent } from './pages/technologies-admin/technologies-admin.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'projects', component: ProjectsAdminComponent },
      { path: 'contacts', component: ContactsAdminComponent },
      { path: 'translations', component: TranslationsAdminComponent },
      { path: 'technologies', component: TechnologiesAdminComponent }
    ]
  }
];

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ContactsFacade, type AdminContact } from './contacts.facade';
import { environment } from '../../../environments/environment';

describe('ContactsFacade', () => {
  let facade: ContactsFacade;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContactsFacade, provideHttpClient(), provideHttpClientTesting()],
    });

    facade = TestBed.inject(ContactsFacade);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should list contacts', () => {
    const mockContacts: AdminContact[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello',
        readAt: null,
        createdAt: new Date().toISOString(),
      },
    ];

    facade.list().subscribe((data) => {
      expect(data).toEqual(mockContacts);
    });

    const req = httpTesting.expectOne(`${environment.apiUrl}/contacts`);
    expect(req.request.method).toBe('GET');
    req.flush(mockContacts);
  });

  it('should mark contact as read', () => {
    const mockUpdated: AdminContact = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello',
      readAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    facade.markAsRead('1').subscribe((data) => {
      expect(data).toEqual(mockUpdated);
    });

    const req = httpTesting.expectOne(`${environment.apiUrl}/contacts/1/read`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({});
    req.flush(mockUpdated);
  });

  it('should remove a contact', () => {
    facade.remove('1').subscribe();

    const req = httpTesting.expectOne(`${environment.apiUrl}/contacts/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});

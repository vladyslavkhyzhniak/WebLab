describe('e2e podstawowe funkcjonalności aplikacji', () => {
  
 beforeEach(() => {
    const mockUser = {
      id: 'e2e-test-user-id',
      email: 'tester@test.com',
      imie: 'Tester',
      nazwisko: 'Tester',
      rola: 'admin',
      czyZablokowany: false
    };
    cy.visit('http://localhost:5173', {
      onBeforeLoad: (window) => {
        window.localStorage.setItem('manageme_session', JSON.stringify(mockUser));
      }
    });
  });

  it('podstawowe funkcjonalności', () => {
    
    //TWORZENIE I EDYCJA PROJEKTU
    cy.log('KROK 1: Projekty');
    cy.get('input[placeholder*="Nazwa projektu" i]').type('Projekt Testowy E2E');
    cy.get('textarea[placeholder*="Opis projektu" i]').type('Opis testowy');
    cy.contains('button', /Dodaj/i).click();
    cy.contains('Projekt Testowy E2E').should('be.visible');

    cy.contains('button', /Edytuj/i).first().click();
    cy.get('input').first().clear().type('Zaktualizowany Projekt E2E');
    cy.contains('button', /Zapisz/i).click();
    cy.contains('Wybierz projekt').first().click(); 


    // TWORZENIE HISTORYJKI 
    cy.log('KROK 2: Historyjki');
    cy.get('input[placeholder="Nazwa historyjki"]').type('Nowa Historyjka E2E');
    cy.get('input[placeholder="Opis historyjki"]').type('Opis testowy');
    cy.get('button#add-story-btn').click();
    
    cy.contains('Nowa Historyjka E2E').should('be.visible');


    // TWORZENIE I ZMIANA STATUSU 
    cy.log('KROK 3: Zadania');
    cy.contains('button', 'Zarządzaj Zadaniami').click();
    
    cy.get('input[placeholder*="Nazwa zadania" i]').type('Zadanie E2E');
    cy.get('input[placeholder*="krótki opis" i]').type('Zadanie E2E');
    cy.contains('button', 'Dodaj Zadanie').click();
    cy.contains('Zadanie E2E').should('be.visible');
    cy.contains('div', 'Zadanie E2E').click();
    cy.get('select#select-pracownika').first().select(1, { force: true });
    cy.get('button').contains("Przypisz i Rozpocznij").click();
    cy.contains('button', '✕').first().click();

    // USUWANIE
    cy.log('KROK 4: Usuwanie');
    cy.contains('button', 'Usuń').first().click();
    cy.contains('button', '✕').click();
    cy.contains('Zadanie E2E').should('not.exist'); 
    cy.contains('Nowa Historyjka E2E').should('not.exist');
  });
});
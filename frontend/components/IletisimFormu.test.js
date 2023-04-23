import React from 'react';
import { getAllByTestId, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';

test('hata olmadan render ediliyor', () => {
render(<IletisimFormu/>);
});

test('iletişim formu headerı render ediliyor', () => {
    render(<IletisimFormu/>);
    const header = screen.getByText("İletişim Formu")
    expect(header).toBeInTheDocument
});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
    render(<IletisimFormu/>);
    const userField=screen.getByLabelText("Ad*");
    userEvent.type(userField, "abcd");
    const error= screen.getByTestId("error");
    expect( error).toBeVisible();
});

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu/>);
    const btn =screen.getByRole("button", "submit");
    userEvent.click(btn);
    const errors = screen.getAllByTestId("error");
    expect(await errors).toHaveLength(3);
});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu/>);
    const userField=screen.getByLabelText("Ad*");
    const userSurnameField=screen.getByPlaceholderText(/Mansız/i);

    userEvent.type(userField, "abcde");
    userEvent.type(userSurnameField, "a");

    const btn =screen.getByRole("button", "submit");
    userEvent.click(btn);

    const errors = screen.getAllByTestId("error");
    expect(await errors).toHaveLength(1);
   
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
render(<IletisimFormu/>);
const email = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i)
userEvent.type(email, "yüzyılıngolcüsühtomail.com");
const errors = screen.getByTestId("error");
    expect(await errors).toHaveTextContent(
        "email geçerli bir email adresi olmalıdır."
    );
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
    render(<IletisimFormu/>);
    const email = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i)
    userEvent.type(email, "yüzyılıngolcüsü@htomail.com");

    const userField=screen.getByLabelText("Ad*");
    userEvent.type(userField, "abdef");

    const btn =screen.getByRole("button", "submit");
    userEvent.click(btn);
    const errors = screen.getByTestId("error");

    expect(await errors).toHaveTextContent(
            "soyad gereklidir."
        );
});

test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
    render(<IletisimFormu/>);
    const email = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i)
    userEvent.type(email, "yüzyılıngolcüsü@htomail.com");

    const userField=screen.getByLabelText("Ad*");
    userEvent.type(userField, "abdef");

    const userSurnameField= screen.getByPlaceholderText(/mansız/i);
    userEvent.type(userSurnameField, "soyisim");

    const btn =screen.getByRole("button", "submit");
    userEvent.click(btn);
   
        await waitFor(
            ()=>{
                const errorAlani = screen.queryAllByTestId("error");
                expect(errorAlani.length).toBe(0);
            },
            {timeout: 4000}
        )
});

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
    render(<IletisimFormu/>);
    userEvent.type(screen.getByPlaceholderText("İlhan"), "Duru");
    userEvent.type(screen.getByPlaceholderText("Mansız"), "Can");
    userEvent.type(screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com"), "duru@can.com");
    userEvent.type(screen.getByText("Mesaj"), "ödev tamamlandı");
    userEvent.click(screen.getByRole("button"));
    expect(await screen.findByTestId("firstnameDisplay")).toHaveTextContent("Duru");
    expect(await screen.findByTestId("lastnameDisplay")).toHaveTextContent("Can");
    expect(await screen.findByTestId("emailDisplay")).toHaveTextContent("duru@can.com");
    expect(await screen.findByTestId("massageDisplay")).toHaveTextContent("ödev tamamlandı");
});

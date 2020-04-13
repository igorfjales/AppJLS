import React, { useEffect, useState, useCallback } from 'react';
import logoImg from '../../assets/logo.svg';
import { FiPower, FiUser } from 'react-icons/fi';
import { IoMdAdd, IoIosRemove } from 'react-icons/io'
import './styles.css';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';

export default function Home() {

    const [meals, setMeals] = useState([]);
    const [listOrder, setListOrder] = useState([]);

    const history = useHistory();
    const physical_client_name = localStorage.getItem('physical_client_name');
    const physical_client_email = localStorage.getItem('physical_client_email')

    //Search for meals, update each key pressed
    const [newSearch, setNewSearch] = useState('');
    const onNewSearchChange = useCallback((event) => {
        setNewSearch(event.target.value);
    });

    async function handleMakeOrder() {

        const response = await api.post('get-order', listOrder);

        let data_order = response.data;

        console.log(data_order);

                try {
                    const response = await api.post('order', data_order);
                    alert(`Pedido realizado com sucesso`);
                     console.log(response)
                } catch (err) {
                    alert('Erro ao fazer pedido.');
                }
    }

    useEffect(() => {
        api.get('home-physical-client', {
            headers: {
                Authorization: physical_client_email,
            }
        }).then(response => {
            setMeals(response.data);

        })
    }, [physical_client_email]);



    function handleRemoveMeal(mealId) {
        let copyOfList = listOrder.slice()
        for (let index = 0; index < copyOfList.length; index++) {
            if (mealId === copyOfList[index].mealId) {
                if (copyOfList[index].qt === 1) {
                    copyOfList.splice(index, 1);
                    setListOrder(copyOfList);

                    return
                }
                copyOfList[index].qt--
                console.log(listOrder);
            }
        }
        setListOrder(copyOfList);
    }

    async function handleAddMeal(mealId) {
        let isInList = false
        let copyOfList = listOrder.slice()
        for (let index = 0; index < copyOfList.length; index++) {
            if (mealId === copyOfList[index].mealId) {
                copyOfList[index].qt++
                isInList = true;
                setListOrder(copyOfList);
                console.log(listOrder);
            }
        }
        if (!isInList) {
            console.log(listOrder);
            await setListOrder([
                ...listOrder,
                mealId = {
                    mealId: mealId,
                    qt: 1
                }
            ]);
            console.log(listOrder);
        }
    }

    function handleLogout() {
        localStorage.clear();
        history.push('/');
    }

    function handleMyProfile() {
        history.push('profile-physical-client');
    }

    return (
        <div className="home-container">
            <header>
                <img src={logoImg} alt="Be The Hero" />

                <span>Bem vindo(a), {physical_client_name}. </span>

                <button onClick={handleLogout} type="button">
                    <FiPower size={18} color="#E02041" />
                </button>

                <button onClick={handleMyProfile} type="button" id="btn_my_profile">
                    <FiUser size={18} color="#E02041" />
                </button>
            </header>
            <form>
                <input
                    placeholder="Nome do prato"
                    value={newSearch}
                    onChange={onNewSearchChange}
                />
            </form>
            <h1>Pratos:</h1>
            <ul >
                {meals.map(meal => (
                    <li key={meal.pk_id_meal}>
                        <strong>PRATO:</strong>
                        <p>{meal.name}</p>

                        <strong>Descrição:</strong>
                        <p>{meal.description}</p>

                        <strong>VALOR:</strong>
                        <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(meal.value)}</p>

                        <button onClick={() => handleAddMeal(meal.pk_id_meal)} type="button">
                            <IoMdAdd size={20} color="gray" />
                        </button>

                        <button id="btn_remove_meal" onClick={() => handleRemoveMeal(meal.pk_id_meal)} type="button">
                            <IoIosRemove size={20} color="gray" />
                        </button>
                    </li>
                ))}
            </ul>
            <button id='finish-order' onClick={() => handleMakeOrder()}>Finalizar pedido</button>
        </div>

    );
}
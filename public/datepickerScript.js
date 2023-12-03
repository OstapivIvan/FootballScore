function initializeDatepicker() {
    const dateFormat = "yy-mm-dd";
    const selectedDateInput = $("#selected_date");
    const urlParams = new URLSearchParams(window.location.search);
    const selectedDate = urlParams.get('selected_date');

    const datepickerOptions = {
        dayNamesMin: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        firstDay: 1,
        monthNames: [
            "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
            "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"
        ],
        dateFormat: dateFormat,
        onSelect: function (dateText, inst) {
            selectedDateInput.val(dateText);
        }
    };

    if (selectedDate) {
        datepickerOptions.defaultDate = selectedDate;
    } else {
        const currentDate = $.datepicker.formatDate(dateFormat, new Date());
        selectedDateInput.val(currentDate);
        datepickerOptions.defaultDate = currentDate;
    }

    $("#datepicker-container").datepicker(datepickerOptions);
}

function handleFilterButtonClick() {
    const selectedDate = $("#selected_date").val();
    const selectedLeagues = $("input[name='leagues[]']:checked").map(function () {
        return $(this).val();
    }).get();
    let url = 'datepicker?selected_date=' + selectedDate;

    if (selectedLeagues.length > 0) {
        url += '&leagues=' + selectedLeagues.join('%2C');
    }

    window.location.href = url;
}

function initializeCheckboxes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const selectedDateInput = $("#selected_date");
    const urlParams = new URLSearchParams(window.location.search);
    const leaguesParam = urlParams.get('leagues');
    const selectedDate = urlParams.get('selected_date');

    if (selectedDate) {
        selectedDateInput.val(selectedDate);
    } else {
        const currentDate = $.datepicker.formatDate("yy-mm-dd", new Date());
        selectedDateInput.val(currentDate);
    }

    checkboxes.forEach(checkbox => {
        checkbox.checked = true; 

        if (leaguesParam) {
            const selectedLeagues = leaguesParam.split(',');
            checkbox.checked = selectedLeagues.includes(checkbox.id);
        }
    });
}

const selectedDate = new URLSearchParams(window.location.search).get('selected_date');
const leagues = new URLSearchParams(window.location.search).get('leagues');
const dataToSend = {
    selected_date: selectedDate,
    leagues: leagues
};

if (selectedDate) {
    $.ajax({
        type: 'GET',
        url: '/matches',
        async: true,
        data: dataToSend,
        success: function (response) {
            if (response && response.matches && response.matches.length > 0) {
                $('.result-container').empty().append(`<h2>Матчі на ${response.selectedDate}</h2>`);

                response.matches.sort((a, b) => {
                    const leagueA = a.competition.name;
                    const leagueB = b.competition.name;
                    return leagueA.localeCompare(leagueB);
                });

                let currentLeague = '';

                response.matches.forEach(match => {
                    const leagueName = match.competition.name;

                    if (leagueName !== currentLeague) {
                        $('.result-container').append(`<h3>League: ${leagueName}</h3>`);
                        currentLeague = leagueName;
                    }

                    const matchDate = match.utcDate;
                    const dateTime = new Date(matchDate);
                    dateTime.setHours(dateTime.getHours() + 24);
                    let kyivTime = dateTime.toLocaleTimeString('uk-UA', { timeZone: 'Europe/Kiev', hour12: false, hour: '2-digit', minute: '2-digit' });
                    const homeGoals = match.score.fullTime.home ?? '-'; 
                    const awayGoals = match.score.fullTime.away ?? '-';

                    const $matchContainer = $('<div class="match-container"></div>');
                    kyivTime = match.status === 'POSTPONED' ? 'Перенесено' : kyivTime;
                    $matchContainer.append(`
                        ${kyivTime}
                        <div class="match-info">
                            <span class="home-info">
                                <span>${match.homeTeam.name}</span>
                                <img class="team-logo" src="${match.homeTeam.crest}" alt="Team Crest">
                            </span>
                            <div class="score ${match.status === 'IN_PLAY' || match.status === 'PAUSED' ? 'highlight' : ''}">
                                ${homeGoals} : ${awayGoals}
                            </div>
                            <span class="away-info">
                                <img class="team-logo" src="${match.awayTeam.crest}" alt="Team Crest">
                                <span>${match.awayTeam.name}</span>
                            </span>
                        </div>
                    `);
                    $('.result-container').append($matchContainer);
                });
            } else {
                $('.result-container').append('<p>No matches found.</p>');
            }
        }
    });
}

$(document).ready(function () {
    initializeDatepicker();
    initializeCheckboxes();

    $("#filter-button").click(handleFilterButtonClick);
});
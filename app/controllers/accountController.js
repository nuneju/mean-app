budgetControllers.controller('AccountListCtrl', ['inScope', 'inHttp',
	function AccountListCtrl(inScope, inHttp) {
		inScope.accounts = [];
		inHttp.get('http://localhost:80/accounts', {
			withCredentials: true
		}).success(function(data) {
			inScope.accounts = data;
		});
		inScope.addAccount = function(account) {
			if (typeof account === "undefined" || account.name === null || account.currency === null) {
				return;
			}
			//Create the new account with form input values
			var a = {};
			a.name = account.name;
			a.currency = account.currency;

			//Save Account
			inHttp.post('http://localhost:80/accounts', a, {
				withCredentials: true
			}).success(function(data) {
				inScope.accounts.push(data);
			});
		};
		inScope.deleteAccount = function(accountId) {
			inHttp.delete('http://localhost:80/accounts/' + accountId, {
				withCredentials: true
			}).success(function(data) {
				var accounts = inScope.accounts;
				for (var accountKey in accounts) {
					if (accounts[accountKey]._id == accountId) {
						inScope.accounts.splice(accountKey, 1);
						return;
					}
				}
			});
		};
	}
]);
budgetControllers.controller('AccountDetailCtrl', ['inScope', '$routeParams', 'inHttp', '$location',
	function AccountDetailCtrl(inScope, $routeParams, inHttp, $location) {
		inScope.categories = [];
		inScope.account = {};
		var account_id = $routeParams.accountId;

		inHttp.get('http://localhost:80/accounts/' + account_id, {
			withCredentials: true
		}).success(function(data) {
			inScope.account = data;
			updateChart();
		}).error(function(data, status) {
			$location.path("/accounts");
		});

		inHttp.get('http://localhost:80/categories', {
			withCredentials: true
		}).success(function(data) {
			inScope.categories = data;
		});

		inScope.addRecord = function(record) {
			if (record === undefined) {
				return;
			}

			var amount = Number(record.amount);
			if (isNaN(amount) || amount <= 0) {
				return;
			}

			//Create the new record with form input values
			var r = {};
			r.category = record.category;
			r.description = record.description;
			r.date = new Date().getTime();
			r.amount = amount;
			r.is_expense = record.type === 0 ? true : false;
			r.account_id = account_id;


			//Save Record
			inHttp.post('http://localhost:80/accounts/' + account_id + '/records', r, {
				withCredentials: true
			}).success(function(data) {
				if (data.is_expense) {
					inScope.account.balance -= data.amount;
				} else {
					inScope.account.balance += data.amount;
				}

				inScope.account.records.push(data);
				updateChart();
			});
		};

		inScope.deleteRecord = function(record) {
			inHttp.delete('http://localhost:80/accounts/' + account_id + '/records/' + record._id, {
				withCredentials: true
			}).success(function(data) {
				var records = inScope.account.records;
				for (var recordKey in records) {
					if (records[recordKey]._id == record._id) {
						if (records[recordKey].is_expense) {
							inScope.account.balance += records[recordKey].amount;
						} else {
							inScope.account.balance -= records[recordKey].amount;
						}

						inScope.account.records.splice(recordKey, 1);
						updateChart();
					}
				}
			});
		};

		function updateChart() {
			var records = inScope.account.records;
			var totalExpense = 0;
			var totalIncome = 0;
			for (var recordKey in records) {
				if (records[recordKey].is_expense) {
					totalExpense += records[recordKey].amount;
				} else {
					totalIncome += records[recordKey].amount;
				}
			}

			var pieData = [{
				value: totalExpense,
				color: "#f2dede"
			}, {
				value: totalIncome,
				color: "#dff0d8"
			}];


			//Display the data
			new Chart(document.getElementById("canvas").getContext("2d")).Pie(pieData);
		}
	}
]);

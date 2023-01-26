// Todo list class
class Activity {
  constructor(activity, activityPriority, activityNote) {
    this.activity = activity;
    this.activityPriority = activityPriority;
    this.activityNote = activityNote;
  }
}

// UI Class
class UI {
  // Add activity
  static addActivity(activities) {
    // Get list parent
    const list = document.querySelector('.activity-list');

    // Create element
    const row = document.createElement('tr');

    // Inner HTML
    row.innerHTML = `
    <td>${activities.activity}</td>
    <td>${activities.activityPriority}</td>
    <td>${activities.activityNote}</td>
    <td>
    <a href="#" class="delete"><i class="bi bi-trash"></i></a>
    </td>
    `;

    list.appendChild(row);
  }

  // Delete activity
  static deleteActivity(target) {
    if (target.parentElement.className === 'delete') {
      target.parentElement.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    // Create Element
    const div = document.createElement('div');

    // Add class
    div.className = `alert ${className}`;

    // Add message
    div.appendChild(document.createTextNode(message));

    // Get parent and sibling reference
    const container = document.querySelector('.container');
    const form = document.querySelector('#activity-form');

    // Insert element
    container.insertBefore(div, form);

    // Set time out
    setTimeout(function () {
      document.querySelector('.alert').remove();
    }, 3000);
  }

  // Clear fields
  static clearFields() {
    document.querySelector('.activity').value = '';
    document.querySelector('.activity-priority').value = '';
    document.querySelector('.activity-note').value = '';
  }
}

// Local storage class
class Store {
  static getActivities() {
    let activities;

    // Validation
    if (localStorage.getItem('activities') === null) {
      activities = [];
    } else {
      activities = JSON.parse(localStorage.getItem('activities'));
    }

    return activities;
  }

  static displayActivities() {
    const activities = Store.getActivities();

    // Add activites to ui
    activities.forEach(function (activity) {
      UI.addActivity(activity);
    });
  }

  static addActivities(activity) {
    const activities = Store.getActivities();

    // Add to local storage
    activities.push(activity);

    localStorage.setItem('activities', JSON.stringify(activities));
  }

  static removeActivities(note) {
    const activities = Store.getActivities();
    console.log(`this is the passed ${note}`);

    activities.forEach(function (activity, index) {
      if (activity.activityNote === note) {
        activities.splice(index, 1);
      }
    });

    localStorage.setItem('activities', JSON.stringify(activities));
  }
}

// Load activities event
document.addEventListener('DOMContentLoaded', Store.displayActivities);

// Add activity listener
const form = document.querySelector('#activity-form');
form.addEventListener('submit', function (e) {
  // Get input values
  const activity = document.querySelector('.activity').value,
    priority = document.querySelector('.activity-priority').value,
    notes = document.querySelector('.activity-note').value;

  // Create new activity instance
  const activities = new Activity(activity, priority, notes);

  // Validation
  if (activity === '' || priority === '') {
    // Show alert
    UI.showAlert('Please fill out the required fields.', 'error');
  } else {
    // Add activity
    UI.addActivity(activities);

    // Add to local storage
    Store.addActivities(activities);

    // Show alert
    UI.showAlert('Activity successfully added!', 'success');

    // Clear input upon submit
    UI.clearFields();
  }

  e.preventDefault();
});

// Delete activity listener
const list = document.querySelector('.activity-list');
list.addEventListener('click', function (e) {
  // Delete activity
  UI.deleteActivity(e.target);

  // Delete from local storage
  Store.removeActivities(
    e.target.parentElement.parentElement.previousElementSibling.textContent
  );

  // Show alert
  UI.showAlert('Activity successfully removed!', 'success');

  e.preventDefault();
});

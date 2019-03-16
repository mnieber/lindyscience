import jquery from "jquery";

export function post(url, data) {
  return jquery.ajax({
    type: "POST",
    url: url,
    data: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  });
}

export function patch(url, data) {
  return jquery.ajax({
    type: "PATCH",
    url: url,
    data: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  });
}

export function get(url) {
  return jquery.ajax({
    type: "GET",
    url: url,
    headers: {
      "Content-type": "application/json",
    },
  });
}

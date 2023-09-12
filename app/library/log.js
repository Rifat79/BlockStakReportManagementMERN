let moment = require('moment');
let fs = require('fs');
let path = require('path');

function file_write(fileName = null, data = null) {
    fs.appendFile(fileName, data, function () {
        return 1;
    });
}

function current_working_directory() {
    return process.cwd();
}

function get_date(date_format = 'YYYY-MM-DD HH:mm:ss') {
    return moment().format(date_format);
}

function log_write(req, directory, subDirectory, prefix, req_res, url = '') {
    let full_path = '';
    if (url) {
        full_path = `${url}--req res--${req_res}`;
    } else {
        full_path = `${req.hostname}${req.baseUrl}${req.path}--req res--${req_res}`;
    }
    let date_format = get_date('YYYY_MM_DD_A');
    let base_path = current_working_directory();
    // create directory if not exists
    if (!fs.existsSync(`${base_path}/${directory}`)) {
        fs.mkdirSync(`${base_path}/${directory}`);
    }
    // create subdirectory if not exists
    if (!fs.existsSync(`${base_path}/${directory}/${subDirectory}`)) {
        fs.mkdirSync(`${base_path}/${directory}/${subDirectory}`);
    }

    let file_directory = path.join(base_path, directory, subDirectory, prefix);
    let fileName = `${file_directory}${date_format}.txt`;
    let date = get_date('YYYY-MM-DD HH:mm:ss');
    let logData = date + '|' + full_path + '\r\n';
    file_write(fileName, logData);
};

module.exports = log_write;
